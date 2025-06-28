import http.server
import socketserver
import os

# Simple static file server for TaskFlow
class StaticHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def create_app():
    """Create a simple WSGI app that serves static files"""
    
    class WSGIStaticApp:
        def __init__(self):
            self.directory = os.path.dirname(os.path.abspath(__file__))
            
        def __call__(self, environ, start_response):
            path = environ['PATH_INFO'].lstrip('/')
            if not path:
                path = 'index.html'
            
            file_path = os.path.join(self.directory, path)
            
            try:
                if os.path.isfile(file_path):
                    with open(file_path, 'rb') as f:
                        content = f.read()
                    
                    # Determine content type
                    if path.endswith('.html'):
                        content_type = 'text/html'
                    elif path.endswith('.css'):
                        content_type = 'text/css'
                    elif path.endswith('.js'):
                        content_type = 'application/javascript'
                    elif path.endswith('.png'):
                        content_type = 'image/png'
                    elif path.endswith('.jpg') or path.endswith('.jpeg'):
                        content_type = 'image/jpeg'
                    else:
                        content_type = 'text/plain'
                    
                    headers = [
                        ('Content-Type', content_type),
                        ('Content-Length', str(len(content))),
                        ('Cache-Control', 'no-cache')
                    ]
                    start_response('200 OK', headers)
                    return [content]
                else:
                    # File not found
                    error_content = b'File not found'
                    headers = [
                        ('Content-Type', 'text/plain'),
                        ('Content-Length', str(len(error_content)))
                    ]
                    start_response('404 Not Found', headers)
                    return [error_content]
                    
            except Exception as e:
                error_content = f'Server error: {str(e)}'.encode()
                headers = [
                    ('Content-Type', 'text/plain'),
                    ('Content-Length', str(len(error_content)))
                ]
                start_response('500 Internal Server Error', headers)
                return [error_content]
    
    return WSGIStaticApp()

# Create the app instance for gunicorn
app = create_app()

if __name__ == "__main__":
    # For direct Python execution
    PORT = 5000
    with socketserver.TCPServer(("0.0.0.0", PORT), StaticHandler) as httpd:
        print(f"Serving TaskFlow at http://0.0.0.0:{PORT}")
        httpd.serve_forever()