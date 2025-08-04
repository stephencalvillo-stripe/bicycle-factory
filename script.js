// Node Editor Application
class NodeEditor {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.connectionsSvg = document.getElementById('connectionsSvg');
        this.configPanel = document.getElementById('configPanel');
        this.configContent = document.getElementById('configContent');
        
        this.nodes = [];
        this.connections = [];
        this.selectedNode = null;
        this.dragState = {
            isDragging: false,
            node: null,
            offsetX: 0,
            offsetY: 0
        };
        
        this.nodeTypes = [
            { value: 'start', label: 'Start Node' },
            { value: 'process', label: 'Process Node' },
            { value: 'decision', label: 'Decision Node' },
            { value: 'end', label: 'End Node' },
            { value: 'data', label: 'Data Node' }
        ];
        
        this.initializeApp();
    }
    
    initializeApp() {
        // Create the first node
        this.createNode(200, 200, 'start');
        
        // Add event listeners
        this.canvas.addEventListener('mousedown', this.handleCanvasMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Prevent default drag behavior
        this.canvas.addEventListener('dragstart', (e) => e.preventDefault());
    }
    
    createNode(x, y, type = 'process') {
        const nodeId = 'node_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';
        nodeElement.setAttribute('data-node-id', nodeId);
        nodeElement.style.left = x + 'px';
        nodeElement.style.top = y + 'px';
        
        nodeElement.innerHTML = `
            <div class="node-header">
                <div class="node-title" onclick="nodeEditor.editNodeName('${nodeId}', this)" title="Click to edit name">Node ${this.nodes.length + 1}</div>
            </div>
            <div class="node-content">
                <select class="node-type-select" onchange="nodeEditor.updateNodeType('${nodeId}', this.value)">
                    ${this.nodeTypes.map(t => `<option value="${t.value}" ${t.value === type ? 'selected' : ''}>${t.label}</option>`).join('')}
                </select>
            </div>
        `;
        
        // Add connection points
        const rightConnection = document.createElement('div');
        rightConnection.className = 'connection-point right';
        rightConnection.onclick = () => this.handleConnectionClick(nodeId, 'right');
        nodeElement.appendChild(rightConnection);
        
        // Add node click handler
        nodeElement.onclick = (e) => {
            e.stopPropagation();
            this.selectNode(nodeId);
        };
        
        // Add mouse down handler for dragging
        nodeElement.onmousedown = (e) => {
            e.stopPropagation();
            this.startDrag(e, nodeId);
        };
        
        this.canvas.appendChild(nodeElement);
        
        const nodeData = {
            id: nodeId,
            element: nodeElement,
            type: type,
            name: `Node ${this.nodes.length + 1}`,
            x: x,
            y: y,
            config: this.getDefaultConfig(type)
        };
        
        this.nodes.push(nodeData);
        
        // Select the first node automatically
        if (this.nodes.length === 1) {
            this.selectNode(nodeId);
        }
        
        return nodeData;
    }
    
    getDefaultConfig(type) {
        const configs = {
            start: {
                message: 'Welcome',
                delay: '0'
            },
            process: {
                operation: 'transform',
                timeout: '30',
                retries: '3'
            },
            decision: {
                condition: 'equals',
                value: 'true',
                operator: 'and'
            },
            end: {
                status: 'success',
                cleanup: 'true'
            },
            data: {
                format: 'json',
                source: 'database',
                cache: 'enabled'
            }
        };
        return configs[type] || {};
    }
    
    updateNodeType(nodeId, newType) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
            node.type = newType;
            node.config = this.getDefaultConfig(newType);
            
            // Update the configuration panel if this node is selected
            if (this.selectedNode === nodeId) {
                this.updateConfigPanel(node);
            }
        }
    }
    
    editNodeName(nodeId, titleElement) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) return;
        
        // Create an input field for editing
        const input = document.createElement('input');
        input.type = 'text';
        input.value = node.name;
        input.className = 'node-title-input';
        input.style.cssText = `
            background: transparent;
            border: 1px solid #6366f1;
            border-radius: 3px;
            padding: 2px 4px;
            font-size: 14px;
            font-weight: bold;
            width: 100%;
            outline: none;
        `;
        
        // Replace the title with the input
        titleElement.style.display = 'none';
        titleElement.parentNode.insertBefore(input, titleElement.nextSibling);
        input.focus();
        input.select();
        
        const finishEditing = () => {
            const newName = input.value.trim() || node.name;
            node.name = newName;
            titleElement.textContent = newName;
            titleElement.style.display = 'block';
            input.remove();
            
            // Update configuration panel if this node is selected
            if (this.selectedNode === nodeId) {
                this.updateConfigPanel(node);
            }
        };
        
        input.addEventListener('blur', finishEditing);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                finishEditing();
            } else if (e.key === 'Escape') {
                titleElement.style.display = 'block';
                input.remove();
            }
        });
        
        // Prevent dragging while editing
        input.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
    }
    
    selectNode(nodeId) {
        // Remove selection from all nodes
        this.nodes.forEach(node => {
            node.element.classList.remove('selected');
        });
        
        // Select the clicked node
        const selectedNode = this.nodes.find(n => n.id === nodeId);
        if (selectedNode) {
            selectedNode.element.classList.add('selected');
            this.selectedNode = nodeId;
            this.updateConfigPanel(selectedNode);
        }
    }
    
    updateConfigPanel(node) {
        const configOptions = {
            start: [
                { key: 'message', label: 'Welcome Message', type: 'select', options: ['Welcome', 'Hello', 'Start Here', 'Begin'] },
                { key: 'delay', label: 'Delay (seconds)', type: 'select', options: ['0', '1', '2', '5', '10'] }
            ],
            process: [
                { key: 'operation', label: 'Operation Type', type: 'select', options: ['transform', 'validate', 'filter', 'aggregate'] },
                { key: 'timeout', label: 'Timeout (seconds)', type: 'select', options: ['10', '30', '60', '120', '300'] },
                { key: 'retries', label: 'Retry Count', type: 'select', options: ['0', '1', '3', '5', '10'] }
            ],
            decision: [
                { key: 'condition', label: 'Condition Type', type: 'select', options: ['equals', 'greater_than', 'less_than', 'contains'] },
                { key: 'value', label: 'Compare Value', type: 'select', options: ['true', 'false', '0', '1', 'null'] },
                { key: 'operator', label: 'Logic Operator', type: 'select', options: ['and', 'or', 'not'] }
            ],
            end: [
                { key: 'status', label: 'End Status', type: 'select', options: ['success', 'failure', 'cancelled', 'timeout'] },
                { key: 'cleanup', label: 'Cleanup Resources', type: 'select', options: ['true', 'false'] }
            ],
            data: [
                { key: 'format', label: 'Data Format', type: 'select', options: ['json', 'xml', 'csv', 'binary'] },
                { key: 'source', label: 'Data Source', type: 'select', options: ['database', 'api', 'file', 'cache'] },
                { key: 'cache', label: 'Enable Caching', type: 'select', options: ['enabled', 'disabled'] }
            ]
        };
        
        const options = configOptions[node.type] || [];
        
        let html = `<h4>${node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node Configuration</h4>`;
        
        // Add name configuration first
        html += `
            <div class="config-item">
                <label>Node Name:</label>
                <input type="text" value="${node.name}" onchange="nodeEditor.updateNodeName('${node.id}', this.value)" placeholder="Enter node name">
            </div>
        `;
        
        options.forEach(option => {
            html += `
                <div class="config-item">
                    <label>${option.label}:</label>
                    <select onchange="nodeEditor.updateNodeConfig('${node.id}', '${option.key}', this.value)">
                        ${option.options.map(opt => 
                            `<option value="${opt}" ${node.config[option.key] === opt ? 'selected' : ''}>${opt}</option>`
                        ).join('')}
                    </select>
                </div>
            `;
        });
        
        this.configContent.innerHTML = html;
    }
    
    updateNodeConfig(nodeId, key, value) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
            node.config[key] = value;
        }
    }
    
    updateNodeName(nodeId, newName) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
            const trimmedName = newName.trim() || node.name;
            node.name = trimmedName;
            
            // Update the visual title in the node
            const titleElement = node.element.querySelector('.node-title');
            if (titleElement) {
                titleElement.textContent = trimmedName;
            }
        }
    }
    
    handleConnectionClick(nodeId, side) {
        // Create a new node connected to this one
        const sourceNode = this.nodes.find(n => n.id === nodeId);
        if (!sourceNode) return;
        
        // Calculate position for new node
        const newX = sourceNode.x + (side === 'right' ? 250 : -250);
        const newY = sourceNode.y + Math.random() * 100 - 50; // Add some randomness
        
        const newNode = this.createNode(Math.max(50, newX), Math.max(50, newY));
        
        // Create connection
        this.createConnection(sourceNode.id, newNode.id);
        
        // Add connection button on the line
        this.addConnectionButton(sourceNode, newNode);
    }
    
    createConnection(fromNodeId, toNodeId) {
        const connection = {
            id: 'conn_' + Date.now(),
            from: fromNodeId,
            to: toNodeId
        };
        
        this.connections.push(connection);
        this.updateConnections();
    }
    
    updateConnections() {
        // Clear existing lines
        this.connectionsSvg.innerHTML = '';
        
        this.connections.forEach(conn => {
            const fromNode = this.nodes.find(n => n.id === conn.from);
            const toNode = this.nodes.find(n => n.id === conn.to);
            
            if (fromNode && toNode) {
                const fromRect = fromNode.element.getBoundingClientRect();
                const toRect = toNode.element.getBoundingClientRect();
                const canvasRect = this.canvas.getBoundingClientRect();
                
                const fromX = fromRect.right - canvasRect.left;
                const fromY = fromRect.top + fromRect.height / 2 - canvasRect.top;
                const toX = toRect.left - canvasRect.left;
                const toY = toRect.top + toRect.height / 2 - canvasRect.top;
                
                // Create curved line
                const midX = (fromX + toX) / 2;
                const path = `M ${fromX} ${fromY} Q ${midX} ${fromY} ${midX} ${(fromY + toY) / 2} Q ${midX} ${toY} ${toX} ${toY}`;
                
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                line.setAttribute('d', path);
                line.setAttribute('class', 'connection-line');
                
                this.connectionsSvg.appendChild(line);
            }
        });
    }
    
    addConnectionButton(fromNode, toNode) {
        // Calculate midpoint between nodes
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        
        const addBtn = document.createElement('div');
        addBtn.className = 'add-node-btn';
        addBtn.style.left = midX + 'px';
        addBtn.style.top = midY + 'px';
        addBtn.innerHTML = '+';
        addBtn.onclick = () => this.insertNodeBetween(fromNode.id, toNode.id, midX, midY);
        
        this.canvas.appendChild(addBtn);
        
        // Remove button after 3 seconds
        setTimeout(() => {
            if (addBtn.parentNode) {
                addBtn.parentNode.removeChild(addBtn);
            }
        }, 3000);
    }
    
    insertNodeBetween(fromNodeId, toNodeId, x, y) {
        // Create new node at the midpoint
        const newNode = this.createNode(x - 75, y - 25); // Offset to center the node
        
        // Remove existing connection
        this.connections = this.connections.filter(c => 
            !(c.from === fromNodeId && c.to === toNodeId)
        );
        
        // Create new connections
        this.createConnection(fromNodeId, newNode.id);
        this.createConnection(newNode.id, toNodeId);
    }
    
    startDrag(e, nodeId) {
        // Prevent dragging when clicking on dropdowns or buttons
        if (e.target.tagName === 'SELECT' || e.target.classList.contains('connection-point')) {
            return;
        }
        
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) return;
        
        this.dragState.isDragging = true;
        this.dragState.node = node;
        this.dragState.offsetX = e.clientX - node.x;
        this.dragState.offsetY = e.clientY - node.y;
        
        node.element.classList.add('dragging');
        this.canvas.classList.add('dragging');
        
        // Select the node being dragged
        this.selectNode(nodeId);
        
        e.preventDefault();
    }
    
    handleCanvasMouseDown(e) {
        // Only handle clicks directly on the canvas (not on nodes)
        if (e.target === this.canvas) {
            // Clicked on canvas background - deselect all nodes
            this.selectedNode = null;
            this.nodes.forEach(node => {
                node.element.classList.remove('selected');
            });
            this.configContent.innerHTML = '<p>Select a node to configure</p>';
        }
    }
    
    handleMouseMove(e) {
        if (this.dragState.isDragging && this.dragState.node) {
            const newX = e.clientX - this.dragState.offsetX;
            const newY = e.clientY - this.dragState.offsetY;
            
            // Keep node within canvas bounds
            const canvasRect = this.canvas.getBoundingClientRect();
            const nodeRect = this.dragState.node.element.getBoundingClientRect();
            
            const clampedX = Math.max(0, Math.min(newX, canvasRect.width - nodeRect.width));
            const clampedY = Math.max(0, Math.min(newY, canvasRect.height - nodeRect.height));
            
            this.dragState.node.x = clampedX;
            this.dragState.node.y = clampedY;
            
            this.dragState.node.element.style.left = clampedX + 'px';
            this.dragState.node.element.style.top = clampedY + 'px';
            
            // Update connections
            this.updateConnections();
        }
    }
    
    handleMouseUp(e) {
        if (this.dragState.isDragging) {
            this.dragState.node.element.classList.remove('dragging');
            this.canvas.classList.remove('dragging');
            
            this.dragState.isDragging = false;
            this.dragState.node = null;
        }
    }
}

// Global functions
function closeApp() {
    const appName = document.getElementById('appTitle').textContent;
    if (confirm(`Are you sure you want to close ${appName}?`)) {
        window.close();
    }
}

function editAppTitle(titleElement) {
    // Create an input field for editing
    const input = document.createElement('input');
    input.type = 'text';
    input.value = titleElement.textContent;
    input.className = 'app-title-input';
    input.style.cssText = `
        background: transparent;
        border: 1px solid #635bff;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 20px;
        font-weight: 600;
        color: #32325d;
        letter-spacing: -0.01em;
        outline: none;
        font-family: inherit;
        min-width: 200px;
    `;
    
    // Replace the title with the input
    titleElement.style.display = 'none';
    titleElement.parentNode.insertBefore(input, titleElement.nextSibling);
    input.focus();
    input.select();
    
    const finishEditing = () => {
        const newTitle = input.value.trim() || titleElement.textContent;
        titleElement.textContent = newTitle;
        titleElement.style.display = 'block';
        input.remove();
        
        // Update the page title as well
        document.title = newTitle;
    };
    
    input.addEventListener('blur', finishEditing);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            finishEditing();
        } else if (e.key === 'Escape') {
            titleElement.style.display = 'block';
            input.remove();
        }
    });
    
    // Prevent any other interactions while editing
    input.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Initialize the application
let nodeEditor;
document.addEventListener('DOMContentLoaded', () => {
    nodeEditor = new NodeEditor();
});