import http.server
import socketserver
import os
from threading import Thread
import webbrowser

class StaticHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def serve_static_files():
    PORT = 5000
    Handler = StaticHTTPRequestHandler
    
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print(f"Serving TaskFlow at http://0.0.0.0:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    serve_static_files()