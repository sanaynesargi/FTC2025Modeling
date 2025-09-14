// FTC Ball Physics Simulation Engine
// Ported from the Python trajectory model

export interface PhysicsConstants {
  // Air properties
  rho_air: number;      // kg/m^3 (air density)
  g: number;           // m/s^2, gravity
  C_D: number;         // drag coefficient
  alpha_CL: number;    // Magnus coefficient factor

  // Ball properties (FTC Artifact)
  m: number;           // kg (ball mass)
  r_b: number;         // m, ball radius
  k: number;           // inertia factor for solid sphere
  A: number;           // projected area

  // Wheel/launcher properties
  R_w: number;         // m, wheel radius
  m_w: number;         // kg, wheel mass
}

export interface SimulationState {
  x: number;           // horizontal position (m)
  y: number;           // vertical position (m)
  Vx: number;          // horizontal velocity (m/s)
  Vy: number;          // vertical velocity (m/s)
  t: number;           // time (s)
}

export interface SimulationParameters {
  omega_w0: number;        // rad/s initial wheel angular velocity
  launch_angle_deg: number; // degrees above horizontal
  initial_height: number;   // m, initial height above ground
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  t: number;
  Vx: number;
  Vy: number;
  V_mag: number;
  drag_force: number;
  magnus_force: number;
}

export class FTCPhysicsSimulation {
  private constants: PhysicsConstants;
  private I_b: number;  // ball moment of inertia
  private I_w: number;  // wheel moment of inertia

  constructor() {
    this.constants = {
      // Air properties
      rho_air: 1.225,
      g: 9.81,
      C_D: 0.50,
      alpha_CL: 0.2,

      // Ball properties
      m: 0.0748,
      r_b: 0.1270 / 2,
      k: 0.4,
      A: 0, // will be calculated

      // Wheel properties
      R_w: 0.048,
      m_w: 0.106
    };

    // Calculate derived values
    this.constants.A = Math.PI * this.constants.r_b ** 2;
    this.I_b = this.constants.k * this.constants.m * this.constants.r_b ** 2;
    this.I_w = 0.5 * this.constants.m_w * this.constants.R_w ** 2;
  }

  /**
   * Calculate exit conditions from wheel launcher
   */
  calculateExitConditions(omega_w0: number): { V_b: number; omega_b: number } {
    const { m, r_b, R_w } = this.constants;
    
    const denom = (1.0 / m) + (r_b ** 2 / this.I_b) + (R_w ** 2 / this.I_w);
    const J = (omega_w0 * R_w) / denom;  // tangential impulse
    const V_b = J / m;                   // exit speed of ball
    const omega_b = (J * r_b) / this.I_b; // ball angular speed after launch

    return { V_b, omega_b };
  }

  /**
   * Trajectory ODE function - returns derivatives [dx/dt, dy/dt, dVx/dt, dVy/dt]
   */
  private trajectoryODE(state: SimulationState, omega_b: number): number[] {
    const { x, y, Vx, Vy } = state;
    const { rho_air, g, C_D, alpha_CL, m, r_b, A } = this.constants;

    const V = Math.sqrt(Vx ** 2 + Vy ** 2);
    
    let drag_acc_x = 0;
    let drag_acc_y = 0;
    let magnus_acc_x = 0;
    let magnus_acc_y = 0;

    if (V > 0) {
      // Drag force
      const F_drag_mag = 0.5 * rho_air * V ** 2 * A * C_D;
      drag_acc_x = -(F_drag_mag / m) * (Vx / V);
      drag_acc_y = -(F_drag_mag / m) * (Vy / V);

      // Magnus force
      const S = omega_b * r_b / V;
      const C_L = alpha_CL * S;
      const F_magnus_mag = 0.5 * rho_air * V ** 2 * A * C_L;
      
      // Magnus force perpendicular to velocity
      magnus_acc_x = (F_magnus_mag / m) * (-Vy / V);
      magnus_acc_y = (F_magnus_mag / m) * (Vx / V);
    }

    return [
      Vx,                                    // dx/dt
      Vy,                                    // dy/dt
      drag_acc_x + magnus_acc_x,             // dVx/dt
      -g + drag_acc_y + magnus_acc_y         // dVy/dt
    ];
  }

  /**
   * Simulate trajectory using Runge-Kutta 4th order integration
   */
  simulateTrajectory(
    params: SimulationParameters,
    dt: number = 0.01,
    maxTime: number = 5.0
  ): TrajectoryPoint[] {
    const { omega_w0, launch_angle_deg, initial_height } = params;
    
    // Calculate exit conditions
    const { V_b, omega_b } = this.calculateExitConditions(omega_w0);
    
    // Initial conditions
    const theta = (launch_angle_deg * Math.PI) / 180;
    const state: SimulationState = {
      x: 0,
      y: initial_height,
      Vx: V_b * Math.cos(theta),
      Vy: V_b * Math.sin(theta),
      t: 0
    };

    const trajectory: TrajectoryPoint[] = [];
    
    while (state.t < maxTime && state.y >= 0) {
      // Record current state
      const V_mag = Math.sqrt(state.Vx ** 2 + state.Vy ** 2);
      const drag_force = V_mag > 0 ? 0.5 * this.constants.rho_air * V_mag ** 2 * this.constants.A * this.constants.C_D : 0;
      const S = V_mag > 0 ? omega_b * this.constants.r_b / V_mag : 0;
      const C_L = this.constants.alpha_CL * S;
      const magnus_force = V_mag > 0 ? 0.5 * this.constants.rho_air * V_mag ** 2 * this.constants.A * C_L : 0;

      trajectory.push({
        x: state.x,
        y: state.y,
        t: state.t,
        Vx: state.Vx,
        Vy: state.Vy,
        V_mag,
        drag_force,
        magnus_force
      });

      // Runge-Kutta 4th order integration
      const k1 = this.trajectoryODE(state, omega_b);
      
      const state_k2 = {
        x: state.x + dt * k1[0] / 2,
        y: state.y + dt * k1[1] / 2,
        Vx: state.Vx + dt * k1[2] / 2,
        Vy: state.Vy + dt * k1[3] / 2,
        t: state.t + dt / 2
      };
      const k2 = this.trajectoryODE(state_k2, omega_b);

      const state_k3 = {
        x: state.x + dt * k2[0] / 2,
        y: state.y + dt * k2[1] / 2,
        Vx: state.Vx + dt * k2[2] / 2,
        Vy: state.Vy + dt * k2[3] / 2,
        t: state.t + dt / 2
      };
      const k3 = this.trajectoryODE(state_k3, omega_b);

      const state_k4 = {
        x: state.x + dt * k3[0],
        y: state.y + dt * k3[1],
        Vx: state.Vx + dt * k3[2],
        Vy: state.Vy + dt * k3[3],
        t: state.t + dt
      };
      const k4 = this.trajectoryODE(state_k4, omega_b);

      // Update state
      state.x += dt * (k1[0] + 2*k2[0] + 2*k3[0] + k4[0]) / 6;
      state.y += dt * (k1[1] + 2*k2[1] + 2*k3[1] + k4[1]) / 6;
      state.Vx += dt * (k1[2] + 2*k2[2] + 2*k3[2] + k4[2]) / 6;
      state.Vy += dt * (k1[3] + 2*k2[3] + 2*k3[3] + k4[3]) / 6;
      state.t += dt;
    }

    return trajectory;
  }

  /**
   * Get physics constants for display
   */
  getConstants(): PhysicsConstants & { I_b: number; I_w: number } {
    return {
      ...this.constants,
      I_b: this.I_b,
      I_w: this.I_w
    };
  }
}
