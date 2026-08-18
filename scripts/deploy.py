"""
Run after images are processed:  python scripts/deploy.py
"""
import subprocess, sys, pathlib, time

REPO = pathlib.Path(__file__).parent.parent

def run(cmd, **kw):
    print(f"$ {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=REPO, capture_output=True, text=True, **kw)
    if result.stdout: print(result.stdout.strip())
    if result.stderr: print(result.stderr.strip())
    if result.returncode != 0:
        print(f"ERROR: exit {result.returncode}")
        sys.exit(result.returncode)
    return result

# Wait for images
dest = REPO / "frontend" / "public" / "images" / "products" / "remote"
print("Waiting for images...")
for _ in range(120):
    if (dest / "cover.webp").exists() and (dest / "gallery-1.webp").exists():
        break
    time.sleep(5)
else:
    print("Images not found after 10 min — aborting.")
    sys.exit(1)

print("Images confirmed. Running git...")

run(["git", "add",
     "frontend/public/images/products/remote/",
     "frontend/data/products.ts",
     "frontend/app/p/[slug]/PdpClient.tsx",
     "frontend/components/checkout/CheckoutModal.tsx",
     "scripts/"])

run(["git", "commit", "-m",
     "feat: remote duplicator — images, gallery, fix InitiateCheckout tracking"])

run(["git", "push"])

print("\nPUSHED OK — EasyPanel will rebuild now.")
