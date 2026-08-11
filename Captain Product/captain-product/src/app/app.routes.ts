import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/directory/directory.component').then(m => m.DirectoryComponent)
  },
  {
    path: 'sync',
    loadComponent: () => import('./pages/sync-flow/sync-flow.component').then(m => m.SyncFlowComponent)
  },
  {
    path: 'all-risk',
    loadComponent: () => import('./pages/all-risk-flow/all-risk-flow.component').then(m => m.AllRiskFlowComponent)
  },
  {
    path: 'product-details',
    loadComponent: () => import('./pages/product-details/product-details.component').then(m => m.ProductDetailsComponent)
  },
  {
    path: 'all-risk-config',
    loadComponent: () => import('./pages/all-risk-config/all-risk-config.component').then(m => m.AllRiskConfigComponent)
  }
];
