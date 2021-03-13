function 右モーター (スピード: number) {
    if (スピード >= 0) {
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P14, 1)
        pins.analogWritePin(AnalogPin.P13, スピード)
    } else {
        pins.digitalWritePin(DigitalPin.P15, 1)
        pins.digitalWritePin(DigitalPin.P14, 0)
        pins.analogWritePin(AnalogPin.P13, スピード * -1)
    }
}
basic.forever(function () {
    basic.showIcon(IconNames.Heart)
    serial.writeValue("0", pins.analogReadPin(AnalogPin.P0))
    serial.writeValue("1", pins.analogReadPin(AnalogPin.P1))
    serial.writeValue("2", pins.analogReadPin(AnalogPin.P2))
    serial.writeLine("-------------------------------------------------")
    右モーター(0)
})
