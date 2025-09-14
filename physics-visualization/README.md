# FTC Ball Physics Simulation

An interactive web-based visualization of FTC (FIRST Tech Challenge) artifact ball trajectory physics, featuring realistic drag force and Magnus effect calculations.

## 🚀 Features

### Physics Engine
- **Accurate Physics Model**: Ported from Python trajectory simulation with Runge-Kutta 4th order integration
- **Realistic Forces**: Includes drag force (air resistance) and Magnus force (ball spin effects)
- **FTC Specifications**: Based on actual FTC ball specifications (74.8g mass, 12.7cm diameter)
- **Launcher Mechanics**: Models wheel-based launcher with impulse calculations

### Interactive Visualization
- **Real-time Canvas**: HTML5 Canvas with dynamic scaling and coordinate transformation
- **Smooth Animation**: 20 FPS trajectory animation with velocity vectors
- **FTC Game Elements**: Reference lines for basket heights (98.45cm low, 136.55cm high)
- **Adaptive Grid**: Grid spacing adjusts based on trajectory scale

### User Controls
- **Parameter Adjustment**: Interactive controls for wheel speed, launch angle, and initial height
- **Quick Presets**: Predefined settings for common FTC scenarios
- **Animation Controls**: Start, stop, and reset functionality
- **Maximize View**: Full-screen trajectory visualization option

### Data Display
- **Real-time Metrics**: Position, velocity, and force data during simulation
- **Trajectory Statistics**: Range, height, flight time, and maximum speed
- **Physics Explanation**: Educational information about forces and effects

## 🛠️ Technology Stack

- **Next.js 15.5.3**: React framework with App Router
- **TypeScript**: Type-safe development
- **Chakra UI v3**: Modern component library with dark theme
- **HTML5 Canvas**: High-performance trajectory rendering
- **Tailwind CSS**: Utility-first styling

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18.18 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd physics-visualization
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Basic Operation
1. **Adjust Parameters**: Use the sliders and inputs in the "Simulation Controls" panel
2. **Start Animation**: Click "Start Animation" to see the trajectory in motion
3. **Monitor Data**: Watch real-time physics data in the "Physics Data" panel
4. **Maximize View**: Click the maximize button (🗖) for full-screen visualization

### Parameter Controls
- **Wheel Speed**: 100-1000 rad/s (displayed in RPM)
- **Launch Angle**: 0-90° above horizontal
- **Initial Height**: 0.1-3.0m above ground

### Quick Presets
- **Default FTC**: Standard competition settings (628 rad/s, 45°, 0.17m)
- **Low Power**: Conservative trajectory (400 rad/s, 30°, 1.0m)
- **High Arc**: Maximum height trajectory (800 rad/s, 60°, 2.0m)

## 📊 Physics Model

### Forces Modeled
1. **Gravity**: Constant 9.81 m/s² downward acceleration
2. **Drag Force**: Air resistance proportional to velocity²
3. **Magnus Force**: Spin-induced force perpendicular to velocity

### Ball Specifications
- **Mass**: 74.8g (0.0748 kg)
- **Diameter**: 12.7cm (0.127m)
- **Moment of Inertia**: Solid sphere model (I = 0.4 * m * r²)

### Launcher Model
- **Wheel Diameter**: 9.6cm (0.096m)
- **Impulse Calculation**: Based on conservation of momentum and energy
- **Exit Conditions**: Calculates ball velocity and spin from wheel speed

## 🎨 Visual Elements

### Color Scheme
- **Trajectory Path**: Blue (#60A5FA)
- **Ball Position**: Orange (#FFA500)
- **Launch Point**: Green (#4ADE80)
- **Impact Point**: Red (#EF4444)
- **FTC Baskets**: Gold (#FFD700)
- **Ground Line**: Brown (#8B4513)

### Reference Lines
- **Low Basket**: 98.45cm height (dotted gold line)
- **High Basket**: 136.55cm height (dotted gold line)
- **Ground**: Solid brown line at y=0

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout with Chakra UI
│   ├── page.tsx        # Main application page
│   ├── providers.tsx   # Chakra UI provider setup
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── TrajectoryCanvas.tsx     # Canvas visualization
│   ├── PhysicsControls.tsx      # Parameter controls
│   └── PhysicsDataDisplay.tsx   # Data display panel
└── lib/
    └── physics.ts      # Physics engine and calculations
```

### Key Components

#### Physics Engine (`src/lib/physics.ts`)
- `FTCPhysicsSimulation`: Main simulation class
- Runge-Kutta integration for trajectory calculation
- Force calculations and exit condition modeling

#### Canvas Component (`src/components/TrajectoryCanvas.tsx`)
- Real-time trajectory rendering
- Animation loop with proper timing
- Dynamic scaling and coordinate transformation

#### Controls (`src/components/PhysicsControls.tsx`)
- Interactive parameter adjustment
- Real-time calculation updates
- Preset configuration management

## 📈 Future Enhancements

- Export trajectory data to CSV
- Multiple ball trajectory comparison
- Wind resistance modeling
- 3D trajectory visualization
- Custom FTC field overlay
- Save/load simulation configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- FTC community for ball specifications and physics insights
- Next.js team for the excellent React framework
- Chakra UI team for the component library
- Physics simulation algorithms based on academic trajectory modeling

---

Built with ❤️ for the FTC community
