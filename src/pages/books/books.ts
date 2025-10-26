import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
// Importa os tipos necessários
import { HttpErrorResponse } from '@angular/common/http'; // Importar HttpErrorResponse
import { BookCard } from '../../components/book-card/book-card';
import { BookAttributes } from '../../models/book.model';
import { PotterDbData, PotterDbResponse } from '../../models/character.model'; // PotterDbResponse
import { PotterdbApi } from '../../services/potterdb-api';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [ CommonModule, BookCard ],
  templateUrl: './books.html',
  styleUrl: './books.scss'
})
export class Books implements OnInit {

  public isLoading = true;
  public error: string | null = null;
  public books: PotterDbData<BookAttributes>[] = [];

  constructor(private potterdbApi: PotterdbApi) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.error = null;

    // Chama o método getBooks (que agora existe no serviço)
    this.potterdbApi.getBooks().subscribe({
      // Adiciona o tipo explícito para 'response'
      next: (response: PotterDbResponse<BookAttributes>) => {
        if (response && response.data) {
          this.books = response.data;
        } else {
          this.books = [];
        }
        this.isLoading = false;
      },
      // Adiciona o tipo explícito para 'err' (pode ser any ou HttpErrorResponse)
      error: (err: HttpErrorResponse | any) => {
        this.error = 'Falha ao carregar os livros.';
        this.isLoading = false;
        // É útil logar o erro real para depuração
        console.error('Erro ao buscar livros:', err.message || err);
      }
    });
  }
}