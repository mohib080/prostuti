import os
import sys
import subprocess
import time
import signal

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

def main():
    print("=" * 65)
    print("  PROSTUTI (প্রস্তুতি) - Prepare. Practice. Prevail.")
    print("  Starting Full Stack Platform (FastAPI + Next.js)...")
    print("=" * 65)

    # 1. Start Backend Process
    print("\n[1/2] Launching Backend on http://127.0.0.1:8000 ...")
    backend_cmd = [sys.executable, "run.py"]
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=BACKEND_DIR,
        shell=False
    )

    time.sleep(2)

    # 2. Start Frontend Process
    print("[2/2] Launching Frontend on http://localhost:3000 ...")
    # On Windows npm is npm.cmd
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "start"],
        cwd=FRONTEND_DIR,
        shell=False
    )

    print("\n" + "=" * 65)
    print("  ALL SERVICES RUNNING SUCCESSFULLY!")
    print("  - Web Portal:   http://localhost:3000")
    print("  - Backend API:  http://127.0.0.1:8000")
    print("  - Swagger Docs: http://127.0.0.1:8000/docs")
    print("  Press Ctrl+C to stop both servers.")
    print("=" * 65 + "\n")

    def signal_handler(sig, frame):
        print("\nStopping PROSTUTI servers...")
        try:
            frontend_proc.terminate()
            backend_proc.terminate()
        except Exception:
            pass
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, signal_handler)

    try:
        while True:
            time.sleep(1)
            # Check if any process terminated unexpectedly
            if backend_proc.poll() is not None:
                print("Backend terminated.")
                break
            if frontend_proc.poll() is not None:
                print("Frontend terminated.")
                break
    except KeyboardInterrupt:
        signal_handler(None, None)

if __name__ == "__main__":
    main()
