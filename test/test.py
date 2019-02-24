
import cv2
import matplotlib.pyplot as plt
fn = "img.jpg"
img = cv2.imread(fn, cv2.IMREAD_GRAYSCALE)

plt.imshow(img)
plt.show()
