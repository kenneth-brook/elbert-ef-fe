class Router {
    constructor() {
      this.routes = {};
      this.initialLoad = true; // Add an initial load flag
      window.addEventListener('hashchange', this.loadCurrentRoute.bind(this));
      window.addEventListener('load', this.loadCurrentRoute.bind(this));
    }
  
    addRoute(pattern, callback) {
      this.routes[pattern] = callback;
    }
  
    navigate(hash) {
      console.log(`Navigating to: ${hash}`);
      window.location.hash = hash; // This changes the URL hash and triggers the hashchange event
    }
  
    loadCurrentRoute() {
      let path = window.location.hash.slice(1); // Get the route without the hash symbol
      if (!path && this.initialLoad) {
        path = 'businesses/list'; // Default to 'businesses/list' if nothing in the URL
      }
  
      console.log(`Attempting to load route: ${path}`);
      let routeFound = false;
  
      for (let pattern in this.routes) {
        const routePattern = new RegExp(`^${pattern.replace(/:\w+/g, '(\\w+)')}$`);
        console.log(`Checking against pattern: ${pattern}`);
        const match = path.match(routePattern);
  
        if (match) {
          console.log(`Match found for pattern: ${pattern}`);
          match.shift(); // Remove the full string match, leave only captured groups
          this.routes[pattern](...match); // Call the route's callback function
          routeFound = true;
          break;
        }
      }
  
      if (!routeFound) {
        console.error('No route found for:', path);
        if (this.initialLoad) {
          this.navigate('businesses/list'); // Navigate to default on initial load
        }
      }
  
      this.initialLoad = false; // Reset initial load flag after first route handling
    }
  }
  
  export default Router;
  
