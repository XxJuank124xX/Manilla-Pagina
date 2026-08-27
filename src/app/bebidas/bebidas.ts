import { Component, OnInit, signal } from '@angular/core';
import { TarjetaBebida } from '../tarjeta-bebida/tarjeta-bebida';
import { ServicioBebida } from '../servicios/servicio-bebidas';
import { Bebida } from '../entidades/bebida';

@Component({
  selector: 'app-bebidas',
  imports: [TarjetaBebida],
  templateUrl: './bebidas.html',
  styleUrl: './bebidas.css',
})
export class Bebidas implements OnInit {

  categorias: string[] = [
    'Beer', 'Cocktail', 'Cocoa', 'Coffee / Tea', 'Homemade Liqueur',
    'Shot', 'Ordinary Drink', 'Soft Drink', 'Other / Unknown',
    'Punch / Party Drink', 'Shake'
  ];

  bebidas = signal<Bebida[]>([]);
  filtroActual: string = '';
  private numeroPeticion = 0;

  constructor(private servicioBebida: ServicioBebida) { }

  ngOnInit(): void {
    this.filtrarPorCategoria(this.categorias[0]);
  }

  buscar(texto: string, criterio: string, tipo: string) {
    this.numeroPeticion += 1;
    let miPeticion = this.numeroPeticion;

    if (texto.trim()) {
      this.filtroActual = '';

      if (criterio === 'nombre') {
        this.servicioBebida.buscarBebidaPorNombre(texto).subscribe(dato => {
          let listado = dato.drinks || [];
          let bebidasEncontradas: Bebida[] = [];
          for (let d of listado) {
            bebidasEncontradas.push(this.crearBebida(d));
          }
          if (miPeticion === this.numeroPeticion) {
            this.bebidas.set(this.filtrarPorTipoLocal(bebidasEncontradas, tipo));
          }
        });
      } else {
        this.servicioBebida.buscarPorIngrediente(texto).subscribe(dato => {
          this.cargarDetalles(dato.drinks || [], miPeticion, tipo);
        });
      }
      return;
    }

    if (tipo) {
      this.filtroActual = '';
      this.servicioBebida.filtrarPorTipo(tipo).subscribe(dato => {
        this.cargarDetalles(dato.drinks || [], miPeticion, '');
      });
      return;
    }

    if (this.filtroActual) {
      this.filtrarPorCategoria(this.filtroActual);
    } else {
      this.filtrarPorCategoria(this.categorias[0]);
    }
  }

  filtrarPorCategoria(categoria: string) {
    this.filtroActual = categoria;
    this.numeroPeticion += 1;
    let miPeticion = this.numeroPeticion;

    this.servicioBebida.filtrarPorCategoria(categoria).subscribe(dato => {
      this.cargarDetalles(dato.drinks || [], miPeticion, '');
    });
  }

  private cargarDetalles(listado: any[], miPeticion: number, tipo: string) {
    let listadoLimitado = listado.slice(0, 24);

    if (listadoLimitado.length === 0) {
      if (miPeticion === this.numeroPeticion) {
        this.bebidas.set([]);
      }
      return;
    }

    let bebidasCargadas: Bebida[] = new Array(listadoLimitado.length);
    let pendientes = listadoLimitado.length;

    for (let indice = 0; indice < listadoLimitado.length; indice++) {
      let d = listadoLimitado[indice];
      this.servicioBebida.obtenerDetalleBebida(d.idDrink).subscribe({
        next: detalle => {
          if (detalle && detalle.drinks && detalle.drinks[0]) {
            bebidasCargadas[indice] = this.crearBebida(detalle.drinks[0]);
          }
          pendientes -= 1;
          if (pendientes === 0 && miPeticion === this.numeroPeticion) {
            this.bebidas.set(this.filtrarPorTipoLocal(bebidasCargadas.filter(b => b), tipo));
          }
        },
        error: () => {
          pendientes -= 1;
          if (pendientes === 0 && miPeticion === this.numeroPeticion) {
            this.bebidas.set(this.filtrarPorTipoLocal(bebidasCargadas.filter(b => b), tipo));
          }
        }
      });
    }
  }

  private filtrarPorTipoLocal(lista: Bebida[], tipo: string): Bebida[] {
    if (!tipo) return lista;
    return lista.filter(b => b.alcoholica === tipo);
  }

  private crearBebida(d: any): Bebida {
    let ingredientes: String[] = [];
    for (let i = 1; i <= 15; i++) {
      let ingrediente = d['strIngredient' + i];
      if (ingrediente && ingrediente.trim() !== '') {
        ingredientes.push(ingrediente);
      }
    }

    let bebida = new Bebida();
    bebida.id = Number(d.idDrink);
    bebida.nombre = d.strDrink;
    bebida.categoria = d.strCategory || '';
    bebida.alcoholica = d.strAlcoholic || '';
    bebida.ingredientes = ingredientes;
    bebida.foto = d.strDrinkThumb;
    bebida.precio = Math.floor(Math.random() * (30000 - 12000 + 1)) + 12000;
    return bebida;
  }
}
