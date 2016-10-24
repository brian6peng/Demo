import { Component, OnInit } from '@angular/core';
import { Hero } from './hero'

@Component({
    selector: 'filetree',
    template: `<div>
	<span>length: {{treeItems.length}}</span>
	<div *ngFor="let item of treeItems">
		<h4>{{item.name}}</h4>
		<span>{{item.author}}</span>
	</div>
</div>`
})

export class PromiseComponent implements OnInit {

    treeItems: Hero[];

    constructor() { }

    ngOnInit(): void {
        this.treeItems = [];
        let item = new Hero();
        item.name = 'hellp';
        this.treeItems.push(item);
        this.getTreeItems();
    }

    getTreeItems(): void {

        this.getTreeItemsSlowly().then(items => this.treeItems = items);
    }

    getTreeItemsSlowly(): Promise<Hero[]> {
        let promiseTemp = this.getTreeItemsSlowly1()
            .then(items => {
                return this.getTreeItemsSlowlyWithArg(items, 'new Pro1', 3000);
            }).then(items => {
                return this.getTreeItemsSlowlyWithArg1(items, 'new Pro2', 2000);
            })
            .then(function (items) {
                return new Promise<Hero[]>(resolve => {
                    setTimeout(() => {
                        let item = new Hero();
                        item.name = 'updating_bound_u';
                        items.push(item);
                        console.log('updating_bound_u1');
                    }, 10000);
                    resolve(items);
                });
            })
            .then(function (items) {
                setTimeout(() => {
                    let item = new Hero();
                    item.name = 'hellp_slow2';
                    items.push(item);

                    console.log('updating1');
                }, 5000);
                return Promise.resolve(items);
            });
        return promiseTemp.then(function (items) {
            setTimeout(() => {
                let item = new Hero();
                item.name = 'hellp_slow3';
                items.push(item);

                console.log('updating2');
            }, 5000);
            return Promise.resolve(items);
        });
    }

    getTreeItemsSlowly1(): Promise<Hero[]> {
        return new Promise<Hero[]>(resolve =>
            setTimeout(() => {
                let item = new Hero();
                item.name = 'hellp_slow1';
                let items = [];
                items.push(item);
                resolve(items);
                console.log('updating');
            }, 2000) // 0.5 seconds
        ).then(function (items) {
            return new Promise<Hero[]>(resolve => {
                setTimeout(() => {
                    let item = new Hero();
                    item.name = 'updating_bound';
                    items.push(item);
                    console.log('updating_bound');
                }, 2000);
                resolve(items)
            });
        });
    }

    getTreeItemsSlowlyWithArg(items, name, timeout): Promise<Hero[]> {
        setTimeout(() => {
            let item = new Hero();
            item.name = name;
            items.push(item);
            console.log('updating');
        }, timeout);

        return new Promise<Hero[]>(resolve =>
            resolve(items)
        );
    }

    getTreeItemsSlowlyWithArg1(items, name, timeout): Promise<Hero[]> {
        setTimeout(() => {
            let item = new Hero();
            item.name = name;
            items.push(item);
            console.log('updating_1');
        }, timeout);

        return new Promise<Hero[]>(resolve =>
            resolve(items)
        );
    }
}