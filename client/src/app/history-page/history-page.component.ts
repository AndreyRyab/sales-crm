import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef!: ElementRef

  isFilterVisible = false;
  tooltip!: MaterialInstance;

  constructor() { }

  ngOnInit() {

  };

  ngOnDestroy() {
    this.tooltip.destroy();
  };

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  };

}
