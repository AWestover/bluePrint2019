
import numpy as np
import cv2
import matplotlib.pyplot as plt
fn = "img.jpg"
img = cv2.imread(fn)
# edges = cv2.Canny(img,100,200)

# hsv = cv2.cvtColor(img, cv2.COLOR_BGR2)

# LOWER_GREY = np.arry([211,211,211])
# UPPER_GREY = np.array([0,0,0])

# colorGreyScores = np.logical_and(np.sum(img, axis=2) < 600, ((img[:,:,0]-img[:,:,1])**2+(img[:,:,1]-img[:,:,2])**2+(img[:,:,0]-img[:,:,2])**2) < 100)
colorGreyScores = ((img[:,:,0]-img[:,:,1])**2+(img[:,:,1]-img[:,:,2])**2+(img[:,:,0]-img[:,:,2])**2) < 10

plt.imshow(img,cmap='gray')
plt.show()
plt.imshow(colorGreyScores,cmap='gray')
plt.show()
