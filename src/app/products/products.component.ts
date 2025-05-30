import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // ngModel uchun kerak
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { Product } from '../models/product.model';
import { ProductService } from '../Services/Product.service';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MatPaginator, ReactiveFormsModule,CommonModule, MatIconModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductComponent implements OnInit {
  dataSource: Product[] = [];
  paginatedData: Product[] = [];
  pageSize = 4;
  errorMessage: string | null = null;
  showAddModal = false;
  showEditModal = false;
  newProduct: Partial<Product> = {};
  selectedProduct: Product | null = null;
  selectedFile: File | null = null;
  addQuantities: { [key: number]: number } = {};
  takeQuantities: { [key: number]: number } = {};
  selectedProductIdForAction: number | null = null;
  currentPageIndex = 0;
  isAdmin = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    // Komponent yaratilganda cookie'dan user ma'lumotlarini tekshirish
    this.authService.getUser().subscribe(user => {
      console.log('User:', user); // Debugging uchun
      this.isAdmin = user?.role.toLowerCase() === 'admin'; // Case-insensitive tekshirish
      this.cdr.detectChanges(); // UI yangilanishini majburlash
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.dataSource = products;
        this.dataSource.forEach(product => {
          this.addQuantities[product.id] = 0;
          this.takeQuantities[product.id] = 1;
        });
        this.refreshPaginatedData();
      },
      error: (err: Error) => {
        this.errorMessage = err.message || 'Mahsulotlarni yuklashda xatolik yuz berdi.';
        console.error(err);
      }
    });
  }

  applySearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.paginatedData = this.dataSource.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );
  }

  openAddProductModal() {
    this.newProduct = { name: '', price: 0, stock: 0, description: '' };
    this.selectedFile = null;
    this.showAddModal = true;
  }

  openEditProductModal(product: Product) {
    this.selectedProduct = { ...product };
    this.selectedFile = null;
    this.showEditModal = true;
  }

  closeModal() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedProduct = null;
    this.newProduct = {};
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  addProduct() {
    if (this.newProduct.name && this.newProduct.price != null && this.newProduct.stock != null) {
      this.productService.addProduct(this.newProduct).subscribe({
        next: (product: Product) => {
          if (this.selectedFile) {
            this.uploadImage(product.id, this.selectedFile).subscribe({
              next: (updatedProduct: Product) => {
                this.dataSource.push(updatedProduct);
                this.addQuantities[updatedProduct.id] = 0;
                this.takeQuantities[updatedProduct.id] = 1;
                this.refreshPaginatedData();
                this.closeModal();
              },
              error: (err: Error) => {
                this.errorMessage = 'Rasm yuklashda xatolik: ' + err.message;
                console.error(err);
              }
            });
          } else {
            this.dataSource.push(product);
            this.addQuantities[product.id] = 0;
            this.takeQuantities[product.id] = 1;
            this.refreshPaginatedData();
            this.closeModal();
          }
        },
        error: (err: Error) => {
          this.errorMessage = 'Mahsulot qo\'shishda xatolik: ' + err.message;
          console.error(err);
        }
      });
    }
  }

  updateProduct() {
    if (this.selectedProduct && this.selectedProduct.id) {
      this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe({
        next: (updatedProduct: Product) => {
          if (this.selectedFile) {
            this.uploadImage(updatedProduct.id, this.selectedFile).subscribe({
              next: (finalProduct: Product) => {
                const index = this.dataSource.findIndex(p => p.id === finalProduct.id);
                if (index !== -1) {
                  this.dataSource[index] = finalProduct;
                  this.refreshPaginatedData();
                }
                this.cdr.detectChanges();
                this.closeModal();
              },
              error: (err: Error) => {
                this.errorMessage = 'Rasm yangilashda xatolik: ' + err.message;
                console.error(err);
              }
            });
          } else {
            const index = this.dataSource.findIndex(p => p.id === updatedProduct.id);
            if (index !== -1) {
              this.dataSource[index] = updatedProduct;
              this.refreshPaginatedData();
            }
            this.cdr.detectChanges();
            this.closeModal();
          }
        },
        error: (err: Error) => {
          this.errorMessage = 'Mahsulotni yangilashda xatolik: ' + err.message;
          console.error(err);
        }
      });
    }
  }

  takeProduct(id: number, quantity: number) {
    if (quantity > 0) {
      this.productService.takeProduct(id, quantity).subscribe({
        next: (updatedProduct: Product) => {
          const index = this.dataSource.findIndex(p => p.id === updatedProduct.id);
          if (index !== -1) {
            this.dataSource[index] = updatedProduct;
            this.refreshPaginatedData();
            this.cdr.detectChanges();
          }
        },
        error: (err: Error) => {
          this.errorMessage = 'Mahsulotni olishda xatolik: ' + err.message;
          console.error(err);
        }
      });
    }
  }

  addToStock(id: number, quantity: number) {
    if (quantity > 0) {
      this.productService.addToStock(id, quantity).subscribe({
        next: (updatedProduct: Product) => {
          const index = this.dataSource.findIndex(p => p.id === updatedProduct.id);
          if (index !== -1) {
            this.dataSource[index] = updatedProduct;
            this.refreshPaginatedData();
            this.cdr.detectChanges();
          }
        },
        error: (err: Error) => {
          this.errorMessage = 'Stok qo\'shishda xatolik: ' + err.message;
          console.error(err);
        }
      });
    } else {
      this.errorMessage = 'Miqdor 0 dan katta bo\'lishi kerak.';
    }
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.dataSource = this.dataSource.filter(p => p.id !== id);
          this.refreshPaginatedData();
          this.cdr.detectChanges();
        },
        error: (err: Error) => {
          this.errorMessage = 'Mahsulotni o\'chirishda xatolik: ' + err.message;
          console.error(err);
        }
      });
    }
  }

  updateAddQuantity(id: number) {
    this.addQuantities[id] = this.addQuantities[id] || 0;
  }

  updateTakeQuantity(id: number) {
    this.takeQuantities[id] = this.takeQuantities[id] || 1;
  }

  private uploadImage(id: number, file: File): Observable<Product> {
    return this.productService.uploadImage(id, file);
  }

  onPageChange(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginatedData = this.dataSource.slice(startIndex, endIndex);
  }

  updatePaginatedData() {
    const startIndex = 0;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.dataSource.slice(startIndex, endIndex);
  }

  refreshPaginatedData() {
    const startIndex = this.currentPageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.dataSource.slice(startIndex, endIndex);
    this.cdr.detectChanges();
  }

  showActions(id: number) {
    this.selectedProductIdForAction = id;
  }

  hideActions() {
    this.selectedProductIdForAction = null;
  }
}