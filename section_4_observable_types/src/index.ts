import { ajax } from "rxjs/ajax";
import { Observable } from "rxjs";

// COLD
// Produces the data inside
// New subscriber means new data is generated (independently from other subscriptions)
// Examples:
// Set of values
// HTTP requests
// Timer/Interval
const ajax$ = ajax<any>("https://random-data-api.com/api/name/random_name");

ajax$.subscribe((data) => console.log("Sub 1:", data.response.first_name));

ajax$.subscribe((data) => console.log("Sub 2:", data.response.first_name));

ajax$.subscribe((data) => console.log("Sub 3:", data.response.first_name));

// HOT
// Data is produced outside (multicasted from a common source)
// All subscribers receive the same data. If subscriber subscribes at a later point -
// it will start receiving the data from this point forward, but not the early data.
// Examples:
// DOM Events
// State
// Subjects
const helloButton = document.querySelector("button#hello");

const helloClick$ = new Observable<MouseEvent>((subscriber) => {
  helloButton.addEventListener("click", (event: MouseEvent) => {
    subscriber.next(event);
  });
});

helloClick$.subscribe((event) =>
  console.log("Sub 1:", event.type, event.x, event.y)
);

setTimeout(() => {
  console.log("Subscription 2 starts");
  helloClick$.subscribe((event) =>
    console.log("Sub 2:", event.type, event.x, event.y)
  );
}, 5000);
