import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  tabs: any[] = [
    { id: 'home', text: 'Home', badge: 0, icon: 'home' },
    { id: 'opcao1', text: 'Opção 1', badge: 0, icon: 'construct' },
    { id: 'opcao2', text: 'Opção 2', badge: 0, icon: 'construct' },
    { id: 'faq', text: 'Faq', badge: 0, icon: 'chatbubble-ellipses' }
  ];
  activeTab = '';
  show = true;

  constructor(private router: Router) {}

  ngOnInit() {
    if (!this.show) {
      this.hideTabs();
    }
  }

  async tabClicked(tab: any) {
    if (tab.text === 'Home') {
      // 👉 Truque para recarregar mesmo que esteja na mesma rota
      await this.router.navigateByUrl('/dummy', { skipLocationChange: true });
      this.router.navigateByUrl('/');
    } else {
      this.router.navigateByUrl('/app/' + tab.id);
    }
  }

  hideTabs() {
    const tabBar = document.getElementById('myTabBar');
    if (tabBar !== null && tabBar.style.display !== 'none') {
      tabBar.style.display = 'none';
    }
  }
}
