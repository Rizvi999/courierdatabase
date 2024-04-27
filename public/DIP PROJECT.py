import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk
import cv2
import numpy as np
import os

class ImageEnhancerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Image Enhancer")
        self.root.configure(bg="#F0F8FF")  # Set background color to sky blue

        self.image_path = ""
        self.original_image = None

        self.create_widgets()

    def create_widgets(self):
        # Image Selection
        self.select_button = tk.Button(self.root, text="Select Image", command=self.select_image, bg="#ADD8E6", activebackground="#87CEEB")
        self.select_button.pack(pady=10)

        # Enhancement Type Selection
        self.enhance_label = tk.Label(self.root, text="Select Enhancement Type:", bg="#F0F8FF")
        self.enhance_label.pack()
        self.enhance_var = tk.StringVar(self.root, "Contrast")  # Default enhancement type
        self.enhance_options = ["Contrast", "Brightness", "Sharpen"]
        self.enhance_dropdown = tk.OptionMenu(self.root, self.enhance_var, *self.enhance_options)
        self.enhance_dropdown.config(bg="#ADD8E6", activebackground="#87CEEB")
        self.enhance_dropdown.pack(pady=5)

        # Enhance Button
        self.enhance_button = tk.Button(self.root, text="Enhance", command=self.enhance_image, bg="#ADD8E6", activebackground="#87CEEB")
        self.enhance_button.pack(pady=5)

        # Show All Enhancements Button
        self.show_all_button = tk.Button(self.root, text="Show All Enhancements", command=self.show_all_enhancements, bg="#ADD8E6", activebackground="#87CEEB")
        self.show_all_button.pack(pady=5)

        # Image Display Frame
        self.image_frame = tk.Frame(self.root, bg="#F0F8FF")
        self.image_frame.pack(pady=10)

        # Image Name Label
        self.image_name_label = tk.Label(self.root, text="", bg="#F0F8FF")
        self.image_name_label.pack()

    def select_image(self):
        self.image_path = filedialog.askopenfilename(filetypes=[("Image files", "*.png;*.jpg;*.jpeg")])
        if self.image_path:
            self.image_name_label.config(text="Selected Image: " + self.image_path.split("/")[-1])
            self.original_image = cv2.imread(self.image_path)

    def enhance_image(self):
        if self.original_image is None:
            messagebox.showerror("Error", "Please select an image first.")
            return
        
        enhancement_type = self.enhance_var.get()

        if enhancement_type == "Contrast":
            enhanced_image = cv2.convertScaleAbs(self.original_image, alpha=1.5, beta=0)
        elif enhancement_type == "Brightness":
            enhanced_image = cv2.convertScaleAbs(self.original_image, alpha=1, beta=50)
        elif enhancement_type == "Sharpen":
            kernel = np.array([[-1, -1, -1],
                               [-1, 9+0.5, -1],
                               [-1, -1, -1]])
            enhanced_image = cv2.filter2D(self.original_image, -1, kernel)

        self.display_images(enhancement_type, self.original_image, enhanced_image)

    def show_all_enhancements(self):
        if self.original_image is None:
            messagebox.showerror("Error", "Please select an image first.")
            return

        enhanced_images = []
        for enhancement_type in self.enhance_options:
            if enhancement_type == "Contrast":
                enhanced_images.append(cv2.convertScaleAbs(self.original_image, alpha=1.5, beta=0))
            elif enhancement_type == "Brightness":
                enhanced_images.append(cv2.convertScaleAbs(self.original_image, alpha=1, beta=50))
            elif enhancement_type == "Sharpen":
                kernel = np.array([[-1, -1, -1],
                                   [-1, 9+0.5, -1],
                                   [-1, -1, -1]])
                enhanced_images.append(cv2.filter2D(self.original_image, -1, kernel))

        self.display_all_images(self.enhance_options, self.original_image, enhanced_images)

    def display_images(self, enhancement_type, original_image, enhanced_image):
        original_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2RGB)
        enhanced_image = cv2.cvtColor(enhanced_image, cv2.COLOR_BGR2RGB)

        original_image = Image.fromarray(original_image)
        enhanced_image = Image.fromarray(enhanced_image)

        # Resize images to fit within window width
        window_width = self.root.winfo_width()
        max_image_width = window_width // 2 - 20
        original_image.thumbnail((max_image_width, max_image_width))
        enhanced_image.thumbnail((max_image_width, max_image_width))

        original_image_tk = ImageTk.PhotoImage(original_image)
        enhanced_image_tk = ImageTk.PhotoImage(enhanced_image)

        if hasattr(self, "original_label"):
            self.original_label.destroy()
        if hasattr(self, "enhanced_label"):
            self.enhanced_label.destroy()
        if hasattr(self, "download_button"):
            self.download_button.destroy()

        self.original_label = tk.Label(self.image_frame, image=original_image_tk, bg="#F0F8FF")
        self.original_label.image = original_image_tk
        self.original_label.grid(row=0, column=0, padx=10)
        tk.Label(self.image_frame, text=enhancement_type, bg="#F0F8FF").grid(row=1, column=0)

        self.enhanced_label = tk.Label(self.image_frame, image=enhanced_image_tk, bg="#F0F8FF")
        self.enhanced_label.image = enhanced_image_tk
        self.enhanced_label.grid(row=0, column=1, padx=10)
        tk.Label(self.image_frame, text=f"{enhancement_type} Enhanced", bg="#F0F8FF").grid(row=1, column=1)

        self.download_button = tk.Button(self.image_frame, text="Download", command=lambda: self.download_image(enhanced_image), bg="#ADD8E6", activebackground="#87CEEB")
        self.download_button.grid(row=2, columnspan=2, pady=5)

    def display_all_images(self, enhancement_types, original_image, enhanced_images):
        original_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2RGB)
        original_image = Image.fromarray(original_image)

        # Resize original image to fit within window width
        window_width = self.root.winfo_width()
        max_image_width = window_width // (len(enhanced_images) + 1) - 20
        original_image.thumbnail((max_image_width, max_image_width))

        original_image_tk = ImageTk.PhotoImage(original_image)

        if hasattr(self, "original_label"):
            self.original_label.destroy()

        self.original_label = tk.Label(self.image_frame, image=original_image_tk, bg="#F0F8FF")
        self.original_label.image = original_image_tk
        self.original_label.grid(row=0, column=0, padx=10)

        for idx, (enhancement_type, enhanced_image) in enumerate(zip(enhancement_types, enhanced_images)):
            enhanced_image = cv2.cvtColor(enhanced_image, cv2.COLOR_BGR2RGB)
            enhanced_image = Image.fromarray(enhanced_image)
            enhanced_image.thumbnail((max_image_width, max_image_width))

            enhanced_image_tk = ImageTk.PhotoImage(enhanced_image)

            if hasattr(self, f"enhanced_label_{idx}"):
                getattr(self, f"enhanced_label_{idx}").destroy()
            if hasattr(self, f"download_button_{idx}"):
                getattr(self, f"download_button_{idx}").destroy()

            setattr(self, f"enhanced_label_{idx}", tk.Label(self.image_frame, image=enhanced_image_tk, bg="#F0F8FF"))
            getattr(self, f"enhanced_label_{idx}").image = enhanced_image_tk
            getattr(self, f"enhanced_label_{idx}").grid(row=0, column=idx+1, padx=10)
            tk.Label(self.image_frame, text=enhancement_type, bg="#F0F8FF").grid(row=1, column=idx+1)

            setattr(self, f"download_button_{idx}", tk.Button(self.image_frame, text="Download", command=lambda img=enhanced_image: self.download_image(img), bg="#ADD8E6", activebackground="#87CEEB"))
            getattr(self, f"download_button_{idx}").grid(row=2, column=idx+1, pady=5)

    def download_image(self, img):
        file_path = filedialog.asksaveasfilename(defaultextension=".png", filetypes=[("PNG files", "*.png")])
        if file_path:
            img.save(file_path)

if __name__ == "__main__":
    root = tk.Tk()
    app = ImageEnhancerApp(root)
    root.mainloop()
