# grow-boilerplate

This is just a basic boilerplate of static page generator using Grow.io. Just my own personal preferences on project structure and etc. This is an expansion of the existing grow.io theme - [base](https://github.com/growthemes/base)

## Prerequisites

At a minimum, you will need the following tools installed:

1. [Git](http://git-scm.com/)
2. [Grow](https://grow.io)

If you do not have Grow, you can install it using:

```
curl https://install.growsdk.org | bash
```

## Running the development server

Prior to starting the development server, you may have to install dependencies used by your project. The `grow install` command walks you through this and tries to set up your environment for you.

The `grow run` command starts your development server. You can make changes to your project files and refresh to see them reflected immediately.

```
grow install
grow run
```

## Building

You can use the `grow build` command to build your whole site to the `build` directory. This is a good way to test and verify the generated code.

```
grow build
```

to minify the html build, please run `gulp htmlmin` right after grow build

## Staging

Once you are ready to share your changes with your team, you can stage your workspace to an access-controlled web server. Running the below command will build your site and deploy it, and then provide you with a link to the staging environment.

```
grow stage
```

## Code structure

The goal is to group respective stylesheet + script together for each partials, common components and macros.

Categorized micro components into:
1. common - common/global components i.e. lightbox
2. macros - generic components generator with dynamic dataset
3. partials - static components
4. pages - all available pages
5. templates - all reusable page templates

## Basic components

By default it comes with the following basic components:
1. back to top button
2. lightbox
3. service worker toast (includes setup)

## Basic features
1. Google analytics tracking logic
- you can assign those trackable markup with 'ga-track' class
- data-track-type (required markup attribute) ~ please make sure that you update the tracking dictionary in `source/js/libs/ga-track.js` should you add a new type
- understanding tracking dictionary object:
  ```
  fixedTrackObject: {
    event_category: 'engagement',
    event_action: 'click'
  },
  dynamicTrackObject: {
    something: 'data-track-something'
  },
  category: 'scroll_to_top'
  ```

  `fixedTrackObject` - is to set GA tracking object value that comes with a fixed value

  `dynamicTrackObject` - is to set GA tracking object value that comes with a dynamic value. The key value of the object items will be treated as the GA tracking key value, and as for the value will be treated as the identifier to get the tracking value from the markup's attribute. Please refer to the `back-to-top` component for example. I know it sounds confusing

2. image lazy loading

## Basic macros
1. button
2. section macro
3. image macro