// Subject is both observer and observable
// we can subscribe to it
// we can call next error and complete methods to broadcast to it's subscribers
import { fromEvent, Subject } from "rxjs";
import { map } from "rxjs/operators";

const emitButton = document.querySelector("button#emit");
const inputElement: HTMLInputElement = document.querySelector("#value-input");
const subscribeButton = document.querySelector("button#subscribe");

const value$ = new Subject<string>();

fromEvent(emitButton, "click")
  .pipe(map(() => inputElement.value))
  .subscribe(value$); //Subjects can be passed as an Observer to the `subscribe` method.

fromEvent(subscribeButton, "click").subscribe(() => {
  console.log("New Subscription");
  value$.subscribe((value) => console.log(value));
});

// BehaviorSubject
import { BehaviorSubject } from "rxjs";
import { withLatestFrom } from "rxjs/operators";

const loggedInSpan: HTMLElement = document.querySelector("span#logged-in");
const loginButton: HTMLElement = document.querySelector("button#login");
const logoutButton: HTMLElement = document.querySelector("button#logout");
const printStateButton: HTMLElement =
  document.querySelector("button#print-state");

const isLoggedIn$ = new BehaviorSubject<boolean>(false);

fromEvent(loginButton, "click").subscribe(() => isLoggedIn$.next(true));
fromEvent(logoutButton, "click").subscribe(() => isLoggedIn$.next(false));

// Navigation bar
isLoggedIn$.subscribe(
  (isLoggedIn) => (loggedInSpan.innerText = isLoggedIn.toString())
);

// Buttons
isLoggedIn$.subscribe((isLoggedIn) => {
  logoutButton.style.display = isLoggedIn ? "block" : "none";
  loginButton.style.display = !isLoggedIn ? "block" : "none";
});

fromEvent(printStateButton, "click")
  .pipe(withLatestFrom(isLoggedIn$))
  .subscribe(([event, isLoggedIn]) =>
    console.log("User is logged in:", isLoggedIn)
  );

// BehaviorSubject vs regular Subject
// When we use Subject the moment we subscribe we won't receive a new value until a new one is pushed
// When we use BehaviorSubject when we subscribe we receive immediately he last known value and any other after that. But we get an initial value.
