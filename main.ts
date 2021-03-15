let 差分 = 0
let 左スピード = 0
let 右スピード = 0
function ライン位置 () {
    差分 = pins.analogReadPin(AnalogPin.P2) - pins.analogReadPin(AnalogPin.P1)
    return 差分
}
function 左モーター (スピード: number) {
    左スピード = スピード
    if (左スピード >= 0) {
        pins.digitalWritePin(DigitalPin.P12, 0)
        pins.digitalWritePin(DigitalPin.P16, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P12, 1)
        pins.digitalWritePin(DigitalPin.P16, 0)
    }
    if (左スピード > 1024) {
        左スピード = 1023
    }
    if (左スピード < -1023) {
        左スピード = -1023
    }
    pins.analogWritePin(AnalogPin.P8, Math.abs(左スピード))
}
function 右モーター (スピード: number) {
    右スピード = スピード
    if (右スピード >= 0) {
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P14, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P15, 1)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }
    if (右スピード > 1024) {
        右スピード = 1023
    }
    if (右スピード < -1023) {
        右スピード = -1023
    }
    pins.analogWritePin(AnalogPin.P13, Math.abs(右スピード))
}
basic.forever(function () {
    basic.showIcon(IconNames.Heart)
    serial.writeValue("0", pins.analogReadPin(AnalogPin.P0))
    serial.writeValue("1", pins.analogReadPin(AnalogPin.P1))
    serial.writeValue("2", pins.analogReadPin(AnalogPin.P2))
    serial.writeValue("line_pos", ライン位置())
    serial.writeLine("-------------------------------------------------")
    右モーター(2000)
    左モーター(2000)
    ライン位置()
})
