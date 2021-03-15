let 差分 = 0
let 左スピード = 0
let 右スピード = 0
function モニタ () {
    serial.writeValue("0", pins.analogReadPin(AnalogPin.P0))
    serial.writeValue("1", pins.analogReadPin(AnalogPin.P1))
    serial.writeValue("2", pins.analogReadPin(AnalogPin.P2))
    serial.writeValue("line_pos", ライン位置())
    serial.writeLine("-------------------------------------------------")
}
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
    // 正転のリミット
    if (左スピード > 1024) {
        左スピード = 1023
    }
    // 逆転のリミット
    if (左スピード < -1023) {
        左スピード = -1023
    }
    // ブレーキ
    if (左スピード == 0) {
        pins.digitalWritePin(DigitalPin.P12, 1)
        pins.digitalWritePin(DigitalPin.P16, 1)
    } else {
        pins.analogWritePin(AnalogPin.P8, Math.abs(左スピード))
    }
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
    // 正転のリミット
    if (右スピード > 1024) {
        右スピード = 1023
    }
    // 逆転のリミット
    if (右スピード < -1023) {
        右スピード = -1023
    }
    // ブレーキ
    if (右スピード == 0) {
        pins.digitalWritePin(DigitalPin.P14, 1)
        pins.digitalWritePin(DigitalPin.P15, 1)
    } else {
        pins.analogWritePin(AnalogPin.P13, Math.abs(右スピード))
    }
}
basic.forever(function () {
    basic.showIcon(IconNames.Heart)
    右モーター(0)
    左モーター(0)
    ライン位置()
})
