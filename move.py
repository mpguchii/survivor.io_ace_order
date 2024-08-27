import UnityPy
import os

bundle_folder = r'C:\Users\mpguc\Downloads\UnityDataAssetPack\assets\aa\Android'
output_base_folder = r'C:\Users\mpguc\Downloads\UnityDataAssetPack\extracted_images'

os.makedirs(output_base_folder, exist_ok=True)

for filename in os.listdir(bundle_folder):
    if filename.endswith('.bundle'):
        bundle_file = os.path.join(bundle_folder, filename)
        base_name = filename.split('_assets_all')[0]
        output_folder = os.path.join(output_base_folder, base_name)
        #os.makedirs(output_folder, exist_ok=True)
        env = UnityPy.load(bundle_file)
        for obj in env.objects:
            if obj.type.name in ["Sprite"]:
                try:
                    data = obj.read()
                    img = data.image
                    if img is not None:
                        img_name = os.path.join(output_base_folder, f"{data.name}.png")
                        img.save(img_name)
                except Exception as e:
                    print(f"Error extracting {data}: {e}")

print("Extraction complete!")
