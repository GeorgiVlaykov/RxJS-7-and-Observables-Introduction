import {
  Observable,
  from,
  of,
  fromEvent,
  timer,
  interval,
  forkJoin,
  combineLatest,
} from "rxjs";
import { ajax } from "rxjs/ajax";

// of() function -> we provide multiple values =========================================================================================================
of("Alice", "Ben", "Charlie").subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("Completed"),
});

// the following code is what we had to do without of():
const names$ = new Observable<string>((subscriber) => {
  subscriber.next("Alice");
  subscriber.next("Ben");
  subscriber.next("Charlie");
  subscriber.complete();
});

names$.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("Completed"),
});

// custom creation function implementation
ourOwnOf("Alice", "Ben", "Charlie").subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("Completed"),
});

function ourOwnOf(...args: string[]): Observable<string> {
  return new Observable<string>((subscriber) => {
    for (let i = 0; i < args.length; i++) {
      subscriber.next(args[i]);
    }
    subscriber.complete();
  });
}

// from() function -> we provide an array, a Promise, an Observable =========================================================================================================

// from(array)
from(["Alice", "Ben", "Charlie"]).subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("Completed"),
});

// from(Promise)
const somePromise = new Promise((resolve, reject) => {
  // resolve('Resolved!');
  reject("Rejected!");
});

const observableFromPromise$ = from(somePromise);

observableFromPromise$.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.log("Error:", err),
  complete: () => console.log("Completed"),
});

// fromEvent() =====================================================================================================================================================
const triggerButton = document.querySelector("button#trigger");

const subscriptionFE = fromEvent<MouseEvent>(triggerButton, "click").subscribe(
  (event) => console.log(event.type, event.x, event.y)
);

// the following code is what we had to do without fromEvent():
const triggerClick$ = new Observable<MouseEvent>((subscriber) => {
  const clickHandlerFn = (event: MouseEvent) => {
    console.log("Event callback executed");
    subscriber.next(event);
  };

  triggerButton.addEventListener("click", clickHandlerFn);

  return () => {
    triggerButton.removeEventListener("click", clickHandlerFn);
  };
});

const subscription = triggerClick$.subscribe((event) =>
  console.log(event.type, event.x, event.y)
);

setTimeout(() => {
  console.log("Unsubscribe");
  subscription.unsubscribe();
}, 5000);

// timer(<ms>) =====================================================================================================================================================
timer(2000).subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("Completed"),
});

// the following code is what we had to do without timer():
const timer$ = new Observable<number>((subscriber) => {
  const timeoutId = setTimeout(() => {
    console.log("Timeout!");
    subscriber.next(0);
    subscriber.complete();
  }, 2000);

  return () => clearTimeout(timeoutId);
});

const subscriptionTimer = timer$.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("Completed"),
});

setTimeout(() => {
  subscriptionTimer.unsubscribe();
  console.log("Unsubscribe");
}, 1000);

// interval(<ms>) =====================================================================================================================================================

const intervalSubs$ = interval(2000).subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("Completed"),
});

setTimeout(() => {
  intervalSubs$.unsubscribe();
  console.log("Unsubscribe");
}, 5000);

// the following code is what we had to do without timer():

const interval$ = new Observable<number>((subscriber) => {
  let counter = 0;

  const intervalId = setInterval(() => {
    console.log("Timeout!");
    subscriber.next(counter++);
  }, 1000);

  return () => clearInterval(intervalId);
});

const subscriptionInterval = interval$.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("Completed"),
});

setTimeout(() => {
  subscriptionInterval.unsubscribe();
  console.log("Unsubscribe");
}, 5000);

// forkJoin(Observable[]) - accepts array of observables =======================================================================================================================
// forkJoin() will wait for all of the observables to complete and then it will execute (previous values are ignored, only the last before the complete is used)
const randomName$ = ajax<{ first_name: string }>(
  "https://random-data-api.com/api/name/random_name"
);

const randomNation$ = ajax<{ capital: string }>(
  "https://random-data-api.com/api/nation/random_nation"
);

const randomFood$ = ajax<{ dish: string }>(
  "https://random-data-api.com/api/food/random_food"
);

// randomName$.subscribe(ajaxResponse => console.log(ajaxResponse.response.first_name));
// randomNation$.subscribe(ajaxResponse => console.log(ajaxResponse.response.capital));
// randomFood$.subscribe(ajaxResponse => console.log(ajaxResponse.response.dish));

forkJoin([randomName$, randomNation$, randomFood$]).subscribe(
  ([nameAjax, nationAjax, foodAjax]) =>
    console.log(
      `${nameAjax.response.first_name} is from ${nationAjax.response.capital} and likes to eat ${foodAjax.response.dish}.`
    )
);

// when forkJoin() errors:

const a$ = new Observable((subscriber) => {
  setTimeout(() => {
    subscriber.next("A");
    subscriber.complete();
  }, 5000);

  return () => {
    console.log("A teardown");
  };
});

const b$ = new Observable((subscriber) => {
  setTimeout(() => {
    subscriber.error("Failure!");
  }, 3000);

  return () => {
    console.log("B teardown");
  };
});

forkJoin([a$, b$]).subscribe({
  next: (value) => console.log(value),
  error: (err) => console.log("Error:", err),
});

// combineLatest(Observable[]) =====================================================================================================================================================
// needs at least 1 value to be emmitted by each source.
// if one of the sources completes before the other, all the values from the active observable will continue to be combined with the latest from the completed observable.
// difference with forkJoin() is that combineLatest() will produce many sets of combinations of "latest" values, where forkJoin() will wait for completed event
// and get the last produced values and create a single set.

const temperatureInput = document.getElementById("temperature-input");
const conversionDropdown = document.getElementById("conversion-dropdown");
const resultText = document.getElementById("result-text");

const temperatureInputEvent$ = fromEvent(temperatureInput, "input");
const conversionInputEvent$ = fromEvent(conversionDropdown, "input");

combineLatest([temperatureInputEvent$, conversionInputEvent$]).subscribe(
  ([temperatureInputEvent, conversionInputEvent]) => {
    const temperature = Number(
      (temperatureInputEvent.target as HTMLInputElement).value
    );
    const conversion = (conversionInputEvent.target as HTMLInputElement).value;

    let result: number;
    if (conversion === "f-to-c") {
      result = ((temperature - 32) * 5) / 9;
    } else if (conversion === "c-to-f") {
      result = (temperature * 9) / 5 + 32;
    }

    resultText.innerText = String(result);
  }
);
