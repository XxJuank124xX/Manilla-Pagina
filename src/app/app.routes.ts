import { Routes } from '@angular/router';
import { Comidas } from './comidas/comidas';
import { Bebidas } from './bebidas/bebidas';
import { Juego } from './juego/juego';
import { Pedidos } from './pedidos/pedidos';

export const routes: Routes = [
  { path: '', pathMatch: 'full', children: [] },
  { path: 'comidas', component: Comidas},
  { path: 'bebidas', component: Bebidas},
  { path: 'juego', component: Juego},
  { path: 'pedidos', component: Pedidos},
  { path: '**', redirectTo: '' }
];