import { bootstrapApplication } from '@angular/platform-browser';
import { appComponentConfig } from './app/app.component.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent,
  {
    ...appComponentConfig,
    providers: [
      ...appComponentConfig.providers || [],
      provideAnimations(),
    ]
  })
  .catch((err) => console.error(err));
