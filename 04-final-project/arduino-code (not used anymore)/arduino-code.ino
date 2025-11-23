// Simple Touch Sensor Reader on A0
// Works for analog touch sensors (capacitive pads, etc.)

const int touchPin = A0;   // Touch sensor connected to analog pin A0
int touchValue = 0;

void setup() {
  Serial.begin(9600);
  pinMode(touchPin, INPUT);
}

void loop() {
  touchValue = analogRead(touchPin);  // Read touch sensor value

  Serial.print("Touch Value: ");
  Serial.println(touchValue);

  delay(100);  // Small delay to make output readable
}
