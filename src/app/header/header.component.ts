import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AuthService } from '../auth/store/auth.service';
import { MessagesService } from '../messages/store/messages.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  @ViewChild('navigation', {static: true}) navigation: ElementRef;

  constructor(private authService: AuthService,
              private router: Router,
              private messagesService: MessagesService) { }

  isAuthenticated$: Observable<boolean>;

  ngOnInit() {
    this.isAuthenticated$ = this.authService.isAuthenticated();

    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(() => {
      this.closeMenu();
    });
  }

  onLogout() {
    this.menuOpen = false;
    this.authService.logout();
    this.messagesService.addInfo('Logged out successfully');
    this.router.navigate(['/']);
  }

  onHamburgerClick() {
    this.menuOpen ? this.closeMenu() : this.openMenu();
  }

  onBackdropClick() {
    this.closeMenu();
  }

  openMenu() {
    this.menuOpen = true;
    (this.navigation.nativeElement as HTMLElement).classList.add('show');
    setTimeout(() => {
      (this.navigation.nativeElement as HTMLElement).classList.add('nav-open');
    }, 10);
  }

  closeMenu() {
    this.menuOpen = false;
    (this.navigation.nativeElement as HTMLElement).classList.remove('nav-open');
    setTimeout(() => {
      (this.navigation.nativeElement as HTMLElement).classList.remove('show');
    }, 600);
  }
}
