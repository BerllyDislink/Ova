import numpy as np
import matplotlib.pyplot as plt

# Parámetros del terreno
size = 50  # Tamaño de la malla (50x50)
scale = 10  # Escala de la variabilidad del terreno

# Crear una malla bidimensional
x = np.linspace(0, 1, size)
y = np.linspace(0, 1, size)
x, y = np.meshgrid(x, y)

# Definir una función de covarianza para el proceso gaussiano
def covariance(x1, y1, x2, y2, length_scale=0.1):
    return np.exp(-((x1 - x2)**2 + (y1 - y2)**2) / (2 * length_scale**2))

# Crear la matriz de covarianza
cov_matrix = np.zeros((size * size, size * size))
for i in range(size):
    for j in range(size):
        for k in range(size):
            for l in range(size):
                cov_matrix[i * size + j, k * size + l] = covariance(x[i, j], y[i, j], x[k, l], y[k, l])

# Generar alturas del terreno usando un proceso gaussiano
mean = np.zeros(size * size)
z = np.random.multivariate_normal(mean, cov_matrix).reshape(size, size)

# Escalar las alturas
z *= scale

# Guardar el mapa de calor en 2D
plt.figure(figsize=(10, 7))
plt.imshow(z, extent=(0, 1, 0, 1), origin='lower', cmap='terrain')
plt.colorbar(label='Altura')
plt.title('Mapa de Calor del Terreno Montañoso')
plt.xlabel('x')
plt.ylabel('y')
plt.savefig('./terrain_heatmap.png')  # Ruta y nombre de archivo corregidos
plt.close()

# Guardar la visualización en 3D
fig = plt.figure(figsize=(10, 7))
ax = fig.add_subplot(111, projection='3d')
ax.plot_surface(x, y, z, cmap='terrain', edgecolor='none')
ax.set_title('Terreno Montañoso en 3D')
ax.set_xlabel('x')
ax.set_ylabel('y')
ax.set_zlabel('Altura')
plt.savefig('./terrain_3d.png')  # Ruta y nombre de archivo corregidos
plt.close()
