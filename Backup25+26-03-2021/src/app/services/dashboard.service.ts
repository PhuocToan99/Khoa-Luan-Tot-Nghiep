import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public hastags = ['C - C# - C++', 'Java Basic','Java Advanced','Python - C','IOS - Android','AI - VR - IOT','Javascript','Gear - Hardware','UX - UI - Designer','Photoshop','SEO Service','Frontend','Framework'];
  constructor() { }
  bigChart() {
    return [{
      name: 'Asia',
      data: [502, 635, 809, 947, 1402, 3634, 5268]
    }, {
      name: 'Africa',
      data: [106, 107, 111, 133, 221, 767, 1766]
    }, {
      name: 'Europe',
      data: [163, 203, 276, 408, 547, 729, 628]
    }, {
      name: 'America',
      data: [18, 31, 54, 156, 339, 818, 1201]
    }, {
      name: 'Oceania',
      data: [2, 2, 2, 6, 13, 30, 46]
    }];
  }

  cards() {
    return [71, 78, 39, 66];
  }
  pieChart() {
    return [{
      name: this.hastags[0],
      y: 4
    }, {
      name: this.hastags[1],
      y: 7
    }, {
      name: this.hastags[2],
      y: 5
    }, {
      name: this.hastags[3],
      y: 6
    }, {
      name: this.hastags[4],
      y: 8
    }, {
      name: this.hastags[5],
      y: 4
    },
    {
      name: this.hastags[6],
      y: 11
    },
    {
      name: this.hastags[7],
      y: 5
    }
  ,{
    name: this.hastags[8],
    y: 9
  },
  {
    name: this.hastags[9],
    y: 7
  },
  {
    name: this.hastags[10],
    y: 4
  },
  {
    name: this.hastags[11],
    y: 13
  },
  {
    name: this.hastags[12],
    y: 17,
    sliced: true,
    selected: true
  }];
  }
}
