import { Observable } from "rxjs";

const observable$ = new Observable<string>((subscriber) => {
  console.log("Obervable being executed");
});

console.log("Before subscribing");
observable$.subscribe();
console.log("After subscribing");

// Output will be:
// Before subscribing
// Obervable being executed
// After subscribing

const observable1$ = new Observable<string>((subscriber) => {
  console.log("Obervable being executed");
  subscriber.next("Alice");
});

console.log("Before subscribing");
observable1$.subscribe((value) => console.log(value));
console.log("After subscribing");

// Output will be:
// Before subscribing
// Obervable being executed
// Alice
// After subscribing

const observable2$ = new Observable<string>((subscriber) => {
  console.log("Obervable being executed");
  subscriber.next("Alice");
  subscriber.next("Ben");
  setTimeout(() => subscriber.next("Charlie"), 2000);
});

console.log("Before subscribing");
observable2$.subscribe((value) => console.log(value));
console.log("After subscribing");

// Output will be:
// Before subscribing
// Obervable being executed
// Alice
// Ben
// After subscribing
// Charlie
const observable3$ = new Observable<string>((subscriber) => {
  console.log("Obervable being executed");
  subscriber.next("Alice");
  subscriber.next("Ben");
  setTimeout(() => {
    subscriber.next("Charlie");
    subscriber.complete();
  }, 7000);

  return () => {
    console.log("Teardown");
  };
});

console.log("Before subscribing");
observable3$.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("Completed"),
});
console.log("After subscribing");

// Output will be:
// Before subscribing
// Obervable being executed
// Alice
// Ben
// After subscribing
// Charlie
// Completed
// Teardown

const observable4$ = new Observable<string>((subscriber) => {
  console.log("Obervable being executed");
  subscriber.next("Alice");
  subscriber.next("Ben");
  setTimeout(() => {
    subscriber.next("Charlie");
    subscriber.complete();
  }, 7000);
  setTimeout(() => {
    subscriber.error(new Error("Failure"));
  }, 4000);

  return () => {
    console.log("Teardown");
  };
});

console.log("Before subscribing");
observable4$.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("Completed"),
  error: (err) => console.log("Error", err),
});
console.log("After subscribing");

// Output will be:
// Before subscribing
// Obervable being executed
// Alice
// Ben
// After subscribing
// Charlie
// Error Error: Failure
// Teardown

const interval$ = new Observable<number>((subscriber) => {
  let counter = 1;

  const intervalId = setInterval(() => {
    console.log("Emitted", counter);
    subscriber.next(counter++);
  }, 2000);

  return () => {
    clearInterval(intervalId);
  };
});

const subscription = interval$.subscribe((value) => console.log(value));

setTimeout(() => {
  console.log("Unsubscribe");
  subscription.unsubscribe();
}, 7000);
