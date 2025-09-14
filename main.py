import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

# ----------------------------
# Constants & ball specs (FTC Artifact)
# ----------------------------
rho_air = 1.225        # kg/m^3 (air density)
g = 9.81               # m/s^2, gravity
C_D = 0.50             # drag coefficient (estimate)
alpha_CL = 0.2         # Magnus coefficient factor for C_L = alpha * S (adjustable)

# Ball (FTC Artifact)
m = 0.0748            # kg (ball mass)
r_b = 0.1270 / 2       # m, ball radius (5 in diameter -> 0.1270 m)
k = 0.4                # inertia factor for a solid sphere (I_b = k * m * r_b^2)

A = np.pi * r_b**2     # projected area

# ----------------------------
# Wheel / launcher inputs (change these as desired)
# ----------------------------
R_w = 0.048            # m, wheel radius (5 cm)
m_w = 0.106             # kg, wheel mass
omega_w0 = 628     # rad/s initial wheel angular velocity (≈ 3820 rpm)
# Note: adjust omega_w0 to match your motor / gearing

# ----------------------------
# Compute exit speed & spin using impulse model
# --------------------------`-
I_b = k * m * r_b**2
I_w = (0.5 * m_w * R_w**2)

V_wheel_surface = omega_w0 * R_w  # wheel surface speed

denom = (1.0/m) + (r_b**2 / I_b) + (R_w**2 / I_w)
J = (omega_w0 * R_w) / denom        # tangential impulse
V_b = J / m                         # exit (center) speed of ball
omega_b = (J * r_b) / I_b           # ball angular speed after launch

# V_b = (omega_w0 * R_w) / (1 + (m * r_b**2)/I_b + (m * R_w**2)/I_w)
# omega_b = (V_b * m * r_b) / I_b

print(f"Exit speed V_b = {V_b:.2f} m/s")
print(f"Ball spin omega_b = {omega_b:.2f} rad/s")

# ----------------------------
# Trajectory ODE setup (2D: x horizontal, y vertical)
# ----------------------------
def trajectory_ode(t, y):
    """
    State vector y = [x, y, Vx, Vy]
    """
    x, y_pos, Vx, Vy = y
    V = np.sqrt(Vx**2 + Vy**2)
    if V == 0:
        drag_acc_x = 0
        drag_acc_y = 0
        magnus_acc_x = 0
        magnus_acc_y = 0
    else:
        # drag force
        F_drag_mag = 0.5 * rho_air * V**2 * A * C_D
        drag_acc_x = - (F_drag_mag / m) * (Vx / V)
        drag_acc_y = - (F_drag_mag / m) * (Vy / V)
        
        # Magnus force, approximate C_L = alpha * S
        S = omega_b * r_b / V
        C_L = alpha_CL * S
        
        F_magnus_mag = 0.5 * rho_air * V**2 * A * C_L
        # spin axis assumed perpendicular to motion plane, producing force perpendicular to velocity
        # directions: (−Vy, Vx) is perpendicular in 2D
        magnus_acc_x =   (F_magnus_mag / m) * ( -Vy / V )
        magnus_acc_y =   (F_magnus_mag / m) * (  Vx / V )
    
    # Equations of motion
    dxdt = Vx
    dydt = Vy
    dVxdt = drag_acc_x + magnus_acc_x
    dVydt = -g + drag_acc_y + magnus_acc_y
    
    return [dxdt, dydt, dVxdt, dVydt]

# ----------------------------
# Initial conditions
# ----------------------------
launch_angle_deg = 45  # degrees above horizontal, adjust as desired
theta = np.deg2rad(launch_angle_deg)
Vx0 = V_b * np.cos(theta)
Vy0 = V_b * np.sin(theta)

x0 = 0.0
y0 = 0.17272               # initial height, 1 m above ground (changeable)

y_init = [x0, y0, Vx0, Vy0]

# ----------------------------
# Time span & integration
# ----------------------------
t_span = (0, 5.0)      # seconds; adjust upper bound to ensure ball lands or to reach desired duration
t_eval = np.linspace(t_span[0], t_span[1], 500)

sol = solve_ivp(trajectory_ode, t_span, y_init, t_eval=t_eval, rtol=1e-6, atol=1e-8)

# ----------------------------
# Extract solution & plot
# ----------------------------
x_sol = sol.y[0]
y_sol = sol.y[1]

# Find where y goes to zero (ground hit)
ground_indices = np.where(y_sol < 0)[0]
if len(ground_indices) > 0:
    first_ground = ground_indices[0]
    x_sol = x_sol[:first_ground+1]
    y_sol = y_sol[:first_ground+1]

plt.figure(figsize=(8,4))
plt.plot(x_sol, y_sol, label=f'Launch angle {launch_angle_deg}°, Vb {V_b:.2f} m/s')
plt.xlabel('Horizontal distance (m)')
plt.ylabel('Height (m)')
plt.title('Trajectory of FTC Artifact Ball with Magnus & Drag')
plt.grid(True)
plt.legend()
plt.show()
