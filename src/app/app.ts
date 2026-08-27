import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navegacion } from './navegacion/navegacion';
import { filter } from 'rxjs';
import { ZonaPricipal } from './zona-pricipal/zona-pricipal';
import { Comidas } from './comidas/comidas';
import { Bebidas } from './bebidas/bebidas';
import { Juego } from './juego/juego';
import { Footer } from "./footer/footer";

@Component({
  selector: 'app-principal',
  imports: [RouterOutlet, Navegacion, ZonaPricipal, Comidas, Bebidas, Juego, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProyectoFinalAngular');
  private router = inject(Router);
  esRutaInicio = true;
  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.esRutaInicio = event.urlAfterRedirects === '/' ;
      });
  }
}
