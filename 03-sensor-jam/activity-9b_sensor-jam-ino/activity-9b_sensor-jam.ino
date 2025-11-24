int sensorPin = A0;   
int sensorValue = 0;   

void setup() {
  Serial.begin(9600);   
}

void loop() {
  sensorValue = analogRead(sensorPin);  
  
  int mappedValue = map(sensorValue, 0, 1023, 10, 300);

  Serial.println(mappedValue);

  delay(50); //update speed
}
