import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ServicioCarrito } from '../servicios/servicio-carrito';

@Component({
  selector: 'app-navegacion',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css',
})
export class Navegacion {
  saltando = false;
  carrito = inject(ServicioCarrito);

  irArriba(event: Event) {
    event.preventDefault();
    this.saltando = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onAnimationEnd() {
    this.saltando = false;
  }
}