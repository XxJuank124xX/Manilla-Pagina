import { Component, OnInit, signal } from '@angular/core';
import { TarjetaPlato } from '../tarjeta-plato/tarjeta-plato';
import { ServicioComida } from '../servicios/servicio-comidas';
import { Plato } from '../entidades/plato';

@Component({
  selector: 'app-comidas',
  imports: [TarjetaPlato],
  templateUrl: './comidas.html',
  styleUrl: './comidas.css',
})
export class Comidas implements OnInit {
  platos = signal<Plato[]>([]);
  categorias = signal<any[]>([]);
  categoriaActual = signal<string>('');

  constructor(private servicioComida: ServicioComida) { }

  ngOnInit(): void {
    this.servicioComida.obtenerCategorias().subscribe(dato => {
      this.categorias.set(dato.categories || []);
      if (this.categorias().length > 0) {
        this.cargarComidasPorCategoria(this.categorias()[0].strCategory);
      }
    });
  }

  cargarComidasPorCategoria(categoria: string) {
    this.categoriaActual.set(categoria);
    this.servicioComida.obtenerComidasPorCategoria(categoria).subscribe(dato => {
      this.cargarDetalles(dato.meals || []);
    });
  }

  buscarPorNombre(nombre: string) {
    if (!nombre.trim()) return;
    this.categoriaActual.set('');
    this.servicioComida.buscarComidaPorNombre(nombre).subscribe(dato => {
      let listado = dato.meals || [];
      let platosEncontrados: Plato[] = [];
      for (let m of listado) {
        platosEncontrados.push(this.crearPlato(m));
      }
      this.platos.set(platosEncontrados);
    });
  }

  buscarPorIngrediente(ingrediente: string) {
    if (!ingrediente.trim()) return;
    this.categoriaActual.set('');
    this.servicioComida.buscarComidaPorIngrediente(ingrediente).subscribe(dato => {
      this.cargarDetalles(dato.meals || []);
    });
  }

  private cargarDetalles(listado: any[]) {
    if (listado.length === 0) {
      this.platos.set([]);
      return;
    }

    let platosCargados: Plato[] = [];
    let pendientes = listado.length;

    for (let m of listado) {
      this.servicioComida.obtenerDetalleComida(m.idMeal).subscribe({
        next: detalle => {
          if (detalle && detalle.meals && detalle.meals[0]) {
            platosCargados.push(this.crearPlato(detalle.meals[0]));
          }
          pendientes -= 1;
          if (pendientes === 0) {
            this.platos.set(platosCargados);
          }
        },
        error: () => {
          pendientes -= 1;
          if (pendientes === 0) {
            this.platos.set(platosCargados);
          }
        }
      });
    }
  }

  private crearPlato(m: any): Plato {
    let ingredientes: String[] = [];
    for (let i = 1; i <= 20; i++) {
      let ingrediente = m['strIngredient' + i];
      if (ingrediente && ingrediente.trim() !== '') {
        ingredientes.push(ingrediente);
      }
    }

    let plato = new Plato();
    plato.id = Number(m.idMeal);
    plato.nombre = m.strMeal;
    plato.categoria = m.strCategory;
    plato.ingredientes = ingredientes;
    plato.foto = m.strMealThumb;
    plato.precio = Math.floor(Math.random() * (40000 - 15000 + 1)) + 15000;
    return plato;
  }
}