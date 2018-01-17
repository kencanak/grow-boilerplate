export default class GATrack {
  constructor() {
    this.CLASSNAMES = {
      TRACKED_ITEM: 'ga-track'
    };

    this.TRACK_DICT = {
      'back-to-top': {
        fixedTrackObject: {
          event_category: 'engagement',
          event_action: 'click'
        },
        dynamicTrackObject: {
          something: 'data-track-something'
        },
        category: 'scroll_to_top'
      }
    };

    this.trackedItems = document.getElementsByClassName(this.CLASSNAMES.TRACKED_ITEM);
  }

  init() {
    this.trackedItems.forEach((trackedItem) => {
      const trackType = trackedItem.getAttribute('data-track-type');

      if (trackType === 'page-view') {
        this.initPageViewTrack(trackedItem);
      } else if (this.TRACK_DICT[trackType]) {
        trackedItem.addEventListener('click', (e) => {
          this.constructEngagementTrackingObject(trackType, trackedItem);
          e.preventDefault();
        }, false);
      }
    });
  }

  constructEngagementTrackingObject(type, elem, manualObject) {
    const trackingConfig = this.TRACK_DICT[type];
    let trackingObject = trackingConfig.fixedTrackObject;

    // do not track if there is extra tracking info needed and there is no supporting info given
    if (!elem && !manualObject && trackingConfig.dynamicTrackObject) {
      return;
    }

    if (trackingConfig.dynamicTrackObject) {
      Object.keys(trackingConfig.dynamicTrackObject).forEach((item) => {
        trackingObject[item] = elem ? elem.getAttribute(trackingConfig.dynamicTrackObject[item]) : manualObject[trackingConfig.dynamicTrackObject[item]];
      });
    }

    this.trackNow(trackingConfig.category, trackingObject);
  }

  initPageViewTrack(item) {
    const inview = new Waypoint.Inview({
      element: item,
      enter: (direction) => {
        if (!item.getAttribute('data-tracked')) {
          this.trackNow('page-view', {
            page_title: item.getAttribute('data-track-article')
          });

          item.setAttribute('data-tracked', true);

          inview.destroy();
        }
      }
    });
  }

  trackNow(type, param) {
    window.gtag('event', type, param);
  }
}