"""Trackers local launcher. No third-party Python packages required."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import functools
import threading
import webbrowser

ROOT = Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
    def list_directory(self, path):
        self.send_error(403, 'Directory listing disabled')
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

if __name__ == '__main__':
    try:
        server = ThreadingHTTPServer(('127.0.0.1', 8080), functools.partial(Handler, directory=str(ROOT)))
    except OSError:
        print('Port 8080 sedang dipakai. Tutup server Trackers lain, lalu coba lagi.')
        raise SystemExit(1)
    print('Trackers Workspace: http://localhost:8080')
    print('Biarkan jendela ini terbuka. Tekan Ctrl+C untuk berhenti.')
    threading.Timer(0.5, lambda: webbrowser.open('http://localhost:8080')).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
