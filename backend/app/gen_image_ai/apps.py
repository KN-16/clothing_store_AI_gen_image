from django.apps import AppConfig
import threading, time

class GenImageAiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'gen_image_ai'

    def ready(self):
        # Start background cleaner thread ONCE per worker
        from . import views
        def idle_cleaner():
            while True:
                time.sleep(60)
                if time.time() - views.last_used > 360:  # 6 minutes
                    views.clean_memory()

        t = threading.Thread(target=idle_cleaner, daemon=True)
        t.start()
        print("Idle cleaner thread for Gen image started")