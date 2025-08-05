# Node Editor

A modern, interactive node-based visual editor built with vanilla HTML, CSS, and JavaScript. Create, connect, and configure nodes with a clean, minimal design inspired by contemporary design tools.

![Node Editor Preview](https://img.shields.io/badge/Status-Live-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 🎨 **Modern Design**
- Clean, minimal interface with high contrast
- Purple accent color (`#675DFF`) for selected elements
- Subtle animations and smooth transitions
- Responsive dot-grid background

### 🔗 **Interactive Nodes**
- **Drag & Drop**: Freely position nodes on the canvas
- **Visual Connections**: Connect nodes with curved lines
- **Multiple Types**: Start, Process, Decision, End, and Data nodes
- **Live Configuration**: Real-time property editing in the sidebar

### ⚙️ **Node Configuration**
- **Editable Names**: Click any node title to rename
- **Type Selection**: Change node behavior with dropdown
- **Custom Properties**: Each node type has specific configuration options
- **Delete Protection**: First node cannot be deleted to maintain workflow integrity

### 🖱️ **User Experience**
- **Intuitive Interface**: Click to select, drag to move, right-click connection points to create new nodes
- **Keyboard Support**: Enter/Escape for editing, standard shortcuts
- **Visual Feedback**: Hover states, selection indicators, and smooth animations

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/stephencalvillo-stripe/bicycle-factory.git
   cd bicycle-factory
   ```

2. Open `index.html` in your web browser:
   ```bash
   open index.html
   ```
   Or simply double-click the file in your file explorer.

## 📖 Usage

### Creating Nodes
1. Click on any connection point (small circles on node edges)
2. A new node will be automatically created and connected
3. Select the new node to configure its properties

### Configuring Nodes
1. Click on any node to select it
2. Use the configuration panel on the right to:
   - Change the node name
   - Select node type
   - Modify type-specific properties

### Node Types

| Type | Description | Properties |
|------|-------------|------------|
| **Start** | Entry point for workflows | Welcome Message, Delay |
| **Process** | Data transformation operations | Operation Type, Timeout, Retries |
| **Decision** | Conditional logic branching | Condition Type, Compare Value, Logic Operator |
| **End** | Workflow termination | End Status, Cleanup Resources |
| **Data** | Data source configuration | Data Format, Source, Caching |

### Editing Names
- **Node Names**: Click any node title to edit inline
- **App Title**: Click the header title to rename the application

## 🏗️ Architecture

### File Structure
```
├── index.html          # Main HTML structure
├── style.css           # Styling and layout
├── script.js           # Application logic
└── README.md           # Documentation
```

### Key Components

#### **NodeEditor Class** (`script.js`)
- Main application controller
- Handles node creation, selection, and configuration
- Manages drag & drop interactions
- Updates visual connections

#### **Styling** (`style.css`)
- Clean, minimal design system
- Smooth animations and transitions
- Responsive layout with flexbox
- Modern glassmorphism-inspired effects

#### **HTML Structure** (`index.html`)
- Semantic layout with header, canvas, and sidebar
- Accessibility-friendly markup
- SVG overlay for connection rendering

## 🎨 Design System

### Colors
- **Background**: `#ffffff` (Pure white)
- **Text**: `#000000` (Pure black)
- **Accent**: `#675DFF` (Purple)
- **Borders**: `#e1e5e9` (Light gray)
- **Secondary**: `#666666` (Medium gray)

### Typography
- **Font Family**: System fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`)
- **Weights**: Regular (400), Medium (500)
- **Sizes**: 12px - 20px range for optimal readability

## 🛠️ Customization

### Adding New Node Types
1. Update the `nodeTypes` array in the `NodeEditor` constructor
2. Add configuration options in `getDefaultConfig()`
3. Define UI properties in `updateConfigPanel()`

### Styling Modifications
- Modify CSS custom properties for consistent theming
- Update color variables for brand customization
- Adjust spacing and sizing in the design system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by modern design tools like Figma and Sketch
- Built with vanilla web technologies for maximum compatibility
- Designed for extensibility and customization

---

**Made with ❤️ for visual workflow creation**