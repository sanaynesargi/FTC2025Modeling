# FTC 2025 Ball Physics Modeling

A comprehensive physics modeling project for FTC (FIRST Tech Challenge) 2025 ball trajectory simulation, featuring both Python-based calculations and an interactive web visualization.

## 📁 Project Structure

```
FTC2025/
├── main.py                    # Original Python physics simulation
├── physics-visualization/     # Interactive web application
├── env/                      # Python virtual environment
└── README.md                 # This file
```

## 🎯 Projects

### 1. Python Physics Model (`main.py`)
The foundational physics simulation implementing:
- **Runge-Kutta 4th order integration** for accurate trajectory calculation
- **Realistic force modeling**: Drag force and Magnus effect from ball spin
- **FTC ball specifications**: 74.8g mass, 12.7cm diameter
- **Wheel launcher mechanics** with impulse-based exit condition calculations
- **Matplotlib visualization** for trajectory plotting

**Key Features:**
- Accurate physics constants (air density, drag coefficient, Magnus coefficient)
- Configurable launch parameters (wheel speed, angle, height)
- Ground impact detection
- Scientific plotting with labeled axes

### 2. Interactive Web Visualization (`physics-visualization/`)
A modern Next.js web application that ports the Python model to the browser:
- **Real-time HTML5 Canvas rendering** with smooth animations
- **Interactive parameter controls** with sliders and number inputs
- **Live physics data display** showing forces, velocity, and trajectory statistics
- **FTC game element references** with basket height indicators
- **Responsive dark theme** optimized for presentations
- **Maximize/minimize views** for detailed trajectory analysis

**Technology Stack:**
- Next.js 15.5.3 with TypeScript
- Chakra UI v3 for modern components
- HTML5 Canvas for high-performance rendering
- Tailwind CSS for styling

## 🚀 Quick Start

### Python Model
```bash
# Activate virtual environment
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies (if not already installed)
pip install numpy scipy matplotlib

# Run simulation
python main.py
```

### Web Application
```bash
# Navigate to web app directory
cd physics-visualization

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## 🔬 Physics Model Details

### Ball Specifications (FTC Official)
- **Mass**: 74.8g (0.0748 kg)
- **Diameter**: 12.7cm (5 inches)
- **Material**: Rubber with consistent bounce properties
- **Moment of Inertia**: Solid sphere approximation (I = 0.4 × m × r²)

### Launcher Configuration
- **Wheel Diameter**: 9.6cm (adjustable in model)
- **Wheel Mass**: 106g (typical motor + wheel assembly)
- **Speed Range**: 100-1000 rad/s (≈955-9550 RPM)

### Forces Modeled
1. **Gravity**: 9.81 m/s² constant downward acceleration
2. **Drag Force**: F_drag = ½ × ρ × v² × A × C_D
   - Air density (ρ): 1.225 kg/m³
   - Drag coefficient (C_D): 0.50 (sphere approximation)
3. **Magnus Force**: F_magnus = ½ × ρ × v² × A × C_L
   - Lift coefficient: C_L = α × S (S = ω×r/v)
   - Magnus coefficient (α): 0.2 (adjustable)

### Game Elements
- **Low Basket Height**: 98.45 cm (38.75 inches)
- **High Basket Height**: 136.55 cm (53.75 inches)
- **Typical Launch Heights**: 17.27 cm to 3.0 m

## 📊 Usage Examples

### Common Scenarios
1. **Standard Competition Shot**: 628 rad/s wheel speed, 45° angle, 17.27cm height
2. **High Arc Shot**: 800 rad/s wheel speed, 60° angle, 2.0m height  
3. **Low Power Shot**: 400 rad/s wheel speed, 30° angle, 1.0m height

### Analysis Capabilities
- **Trajectory Optimization**: Find optimal angles for target distances
- **Power Analysis**: Determine minimum wheel speeds for basket clearance
- **Spin Effect Studies**: Compare trajectories with/without Magnus force
- **Launch Height Impact**: Analyze elevation advantages

## 🎮 Interactive Features (Web App)

### Visualization
- **Real-time Animation**: 20 FPS trajectory simulation with ball tracking
- **Velocity Vectors**: Visual representation of ball velocity during flight  
- **Impact Prediction**: Ground strike point highlighting
- **Reference Lines**: FTC basket heights for strategic planning

### Controls
- **Parameter Sliders**: Intuitive adjustment of physics variables
- **Quick Presets**: One-click common scenario loading
- **Animation Control**: Start, stop, reset functionality
- **View Modes**: Normal and maximized visualization options

### Data Analysis
- **Live Metrics**: Position, velocity, and force calculations
- **Trajectory Statistics**: Range, height, flight time summaries
- **Force Breakdown**: Individual drag and Magnus force contributions
- **Educational Content**: Physics explanations and visual legends

## 🔬 Development & Customization

### Python Model Extensions
```python
# Modify physics constants in main.py
rho_air = 1.225      # Air density (kg/m³)
C_D = 0.50           # Drag coefficient
alpha_CL = 0.2       # Magnus coefficient

# Adjust ball specifications
m = 0.0748           # Ball mass (kg)
r_b = 0.1270 / 2     # Ball radius (m)
```

### Web App Customization
```typescript
// Modify physics constants in src/lib/physics.ts
const constants = {
  rho_air: 1.225,    // Air density
  g: 9.81,           // Gravity
  C_D: 0.50,         // Drag coefficient
  alpha_CL: 0.2,     // Magnus coefficient
  // ... ball and launcher specs
}
```

**Built for FTC Teams 🤖 | Advancing STEM Education 📚 | Open Source Physics 🔬**
