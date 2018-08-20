import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IWishlist } from 'app/shared/model/wishlist.model';
import { Principal } from 'app/core';
import { WishlistService } from './wishlist.service';

@Component({
    selector: 'jhi-wishlist',
    templateUrl: './wishlist.component.html'
})
export class WishlistComponent implements OnInit, OnDestroy {
    wishlists: IWishlist[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private wishlistService: WishlistService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.wishlistService.query().subscribe(
            (res: HttpResponse<IWishlist[]>) => {
                this.wishlists = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInWishlists();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IWishlist) {
        return item.id;
    }

    registerChangeInWishlists() {
        this.eventSubscriber = this.eventManager.subscribe('wishlistListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
