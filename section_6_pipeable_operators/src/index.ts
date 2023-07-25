import { Observable, filter } from "rxjs";

// filter() ==========================================================================================================================================

interface NewsItem {
  category: "Business" | "Sports";
  content: string;
}

const newsFeed$ = new Observable<NewsItem>((subscriber) => {
  setTimeout(
    () => subscriber.next({ category: "Business", content: "A" }),
    1000
  );
  setTimeout(() => subscriber.next({ category: "Sports", content: "B" }), 3000);
  setTimeout(
    () => subscriber.next({ category: "Business", content: "C" }),
    4000
  );
  setTimeout(() => subscriber.next({ category: "Sports", content: "D" }), 6000);
  setTimeout(
    () => subscriber.next({ category: "Business", content: "E" }),
    7000
  );
});

const sportsNewsFeed$ = newsFeed$.pipe(
  filter((item) => item.category === "Sports")
);

newsFeed$.subscribe((item) => console.log(item));

// map() ==========================================================================================================================================

import { forkJoin } from "rxjs";

import { ajax } from "rxjs/ajax";
import { map } from "rxjs/operators";

const randomFirstName$ = ajax<any>(
  "https://random-data-api.com/api/name/random_name"
).pipe(map((ajaxResponse) => ajaxResponse.response.first_name));

const randomCapital$ = ajax<any>(
  "https://random-data-api.com/api/nation/random_nation"
).pipe(map((ajaxResponse) => ajaxResponse.response.capital));

const randomDish$ = ajax<any>(
  "https://random-data-api.com/api/food/random_food"
).pipe(map((ajaxResponse) => ajaxResponse.response.dish));

forkJoin([randomFirstName$, randomCapital$, randomDish$]).subscribe(
  ([firstName, capital, dish]) =>
    console.log(`${firstName} is from ${capital} and likes to eat ${dish}.`)
  // Mike is from New Delhi and likes to eat pasta.
);

// tap() ==========================================================================================================================================
// https://jaywoz.medium.com/information-is-king-tap-how-to-console-log-in-rxjs-7fc09db0ad5a
import { of } from "rxjs";
import { tap } from "rxjs/operators";

of(1, 7, 3, 6, 2)
  .pipe(
    filter((value) => value > 5),
    map((value) => value * 2),
    tap({
      next: (value) => console.log("Spy:", value),
    })
  )
  .subscribe((value) => console.log("Output:", value));

// debounceTime() ==========================================================================================================================================
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";

const sliderInput = document.querySelector("input#slider");

fromEvent(sliderInput, "input")
  .pipe(
    debounceTime(2000),
    map((event) => (event.target as HTMLInputElement).value)
  )
  .subscribe((value) => console.log(value));

// catchError() ==========================================================================================================================================
import { EMPTY } from "rxjs"; // this returns a new Observable that doesn't emmit any values and immediately completes
import { catchError } from "rxjs/operators";

const failingHttpRequest$ = new Observable((subscriber) => {
  setTimeout(() => {
    subscriber.error(new Error("Timeout"));
  }, 3000);
});

console.log("App started");

failingHttpRequest$.pipe(catchError((error) => EMPTY)).subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("Completed"),
});
// ====================================================================================================================================================================================================================================================================================
// Flattening Operators
// concatMap(): static example ==========================================================================================================================================
// concatMap(), replaces each emmitted  value from an observer with multiple single-emmitted values down the stream. It will "flatten" them.
import { concatMap } from "rxjs/operators";

const source$ = new Observable((subscriber) => {
  setTimeout(() => subscriber.next("A"), 2000);
  setTimeout(() => subscriber.next("B"), 5000);
});

console.log("App has started");
source$
  .pipe(concatMap((value) => of(1, 2)))
  .subscribe((value) => console.log(value));

// Output:
// 1
// 2
// 1
// 2

// concatMap(): Dynamic HTTP Request example
const endpointInput: HTMLInputElement =
  document.querySelector("input#endpoint");
const fetchButton = document.querySelector("button#fetch");

fromEvent(fetchButton, "click")
  .pipe(
    map(() => endpointInput.value),
    concatMap((value) =>
      ajax(`https://random-data-api.com/api/${value}/random_${value}`)
    )
  )
  .subscribe((value) => console.log(value));
