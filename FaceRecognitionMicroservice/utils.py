import os
import cv2
import base64
import numpy as np
from deepface import DeepFace

FACE_DB_DIR = "face_db"

def decode_image(image_base64):
    image_data = base64.b64decode(image_base64)
    np_arr = np.frombuffer(image_data, np.uint8)
    return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

def save_reference_face(employee_id, image_base64):
    image = decode_image(image_base64)
    filepath = os.path.join(FACE_DB_DIR, f"{employee_id}.jpg")
    cv2.imwrite(filepath, image)
    return filepath

def verify_face(employee_id, image_base64):
    try:
        img1 = os.path.join(FACE_DB_DIR, f"{employee_id}.jpg")
        img2 = decode_image(image_base64)

        result = DeepFace.verify(img1_path=img1, img2_path=img2, enforce_detection=False)
        return result["verified"], result["distance"]
    except Exception as e:
        return False, str(e)
