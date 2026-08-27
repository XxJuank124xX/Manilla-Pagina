import { Component } from '@angular/core';
import { TarjetaPlato } from "../tarjeta-plato/tarjeta-plato";
import { Footer } from '../footer/footer';



@Component({
  selector: 'app-zona-pricipal',
  imports: [TarjetaPlato, Footer],
  templateUrl: './zona-pricipal.html',
  styleUrl: './zona-pricipal.css',
})
export class ZonaPricipal {}

