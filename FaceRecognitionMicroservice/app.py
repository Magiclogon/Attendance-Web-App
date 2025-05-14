
from flask import Flask, request, jsonify
import os
import numpy as np
from deepface import DeepFace
import cv2
from datetime import datetime
import pickle
import shutil
import uuid

app = Flask(__name__)

# Configure directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
DATABASE_FOLDER = os.path.join(BASE_DIR, 'face_db')
EMBEDDINGS_FILE = os.path.join(DATABASE_FOLDER, 'face_embeddings.pkl')

# Create necessary directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(DATABASE_FOLDER, exist_ok=True)

# Set DeepFace configurations
MODEL_NAME = "VGG-Face"
DISTANCE_METRIC = "cosine"
DETECTOR_BACKEND = "opencv"

# Load existing embeddings or create empty database
face_db = {}
if os.path.exists(EMBEDDINGS_FILE):
    with open(EMBEDDINGS_FILE, 'rb') as f:
        face_db = pickle.load(f)

def save_embeddings():
    with open(EMBEDDINGS_FILE, 'wb') as f:
        pickle.dump(face_db, f)

def process_image(image_path):
    try:
        # detect faces (1 face max)
        faces = DeepFace.extract_faces(image_path, detector_backend=DETECTOR_BACKEND)
        
        if len(faces) == 0:
            return None, "No face detected in the image"
        elif len(faces) > 1:
            return None, "Multiple faces detected in the image"
        
        # Get embedding
        embedding = DeepFace.represent(image_path, 
                                       model_name=MODEL_NAME, 
                                       detector_backend=DETECTOR_BACKEND)
        
        return embedding, None
    except Exception as e:
        return None, f"Error processing image: {"Could not detect face"}"

@app.route('/register-face', methods=['POST'])
def register_face():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image provided'}), 400
    
    if 'employee_id' not in request.form:
        return jsonify({'success': False, 'error': 'No employee ID provided'}), 400
    
    employee_id = request.form['employee_id']
    image = request.files['image']
    
    # Save image temporarily
    temp_filename = f"{uuid.uuid4()}.jpg"
    temp_path = os.path.join(UPLOAD_FOLDER, temp_filename)
    image.save(temp_path)
    
    try:
        # get face embedding from image
        embedding, error = process_image(temp_path)
        if error:
            return jsonify({'success': False, 'error': error}), 400
        
        # Save face information in database
        face_db[employee_id] = {
            'embedding': embedding,
            'registered_at': datetime.now().isoformat(),
            'last_updated': datetime.now().isoformat()
        }
        
        # If this is a new registration, create a folder for the employee
        employee_folder = os.path.join(DATABASE_FOLDER, employee_id)
        os.makedirs(employee_folder, exist_ok=True)
        
        # Save the image
        registration_image = os.path.join(employee_folder, f"registered_face.jpg")
        shutil.copy(temp_path, registration_image)
        
        # Save embeddings
        save_embeddings()
        
        return jsonify({
            'success': True, 
            'message': f'Face registered successfully for employee {employee_id}'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.route('/verify-face', methods=['POST'])
def verify_face():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image provided'}), 400
    
    if 'employee_id' not in request.form:
        return jsonify({'success': False, 'error': 'No employee ID provided'}), 400
    
    employee_id = request.form['employee_id']
    image = request.files['image']
    
    # Employee exists?
    if employee_id not in face_db:
        return jsonify({'success': False, 'error': 'Employee not registered'}), 404
    
    # Save temp image
    temp_filename = f"{uuid.uuid4()}.jpg"
    temp_path = os.path.join(UPLOAD_FOLDER, temp_filename)
    image.save(temp_path)
    
    try:
        # Get current face embedding
        current_embedding, error = process_image(temp_path)
        if error:
            return jsonify({'success': False, 'error': error}), 400
        
        # Get registered embedding
        registered_embedding = face_db[employee_id]['embedding']
        
        # Verify face
        try:
            # save the sent image to use it with deepface
            registered_face_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4()}_reg.jpg")
            shutil.copy(os.path.join(DATABASE_FOLDER, employee_id, "registered_face.jpg"), registered_face_path)
            
            # use deepface
            result = DeepFace.verify(
                img1_path=temp_path,
                img2_path=registered_face_path,
                model_name=MODEL_NAME,
                distance_metric=DISTANCE_METRIC,
                detector_backend=DETECTOR_BACKEND
            )
            
            # delete temp files
            if os.path.exists(registered_face_path):
                os.remove(registered_face_path)
                
            return jsonify({
                'success': True,
                'match': bool(result['verified']),
                'confidence': float(result['distance']),
                'threshold': float(result['threshold']),
                'employee_id': employee_id
            })
            
        except Exception as e:
            return jsonify({'success': False, 'error': f"Verification error: {str(e)}"}), 500
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)