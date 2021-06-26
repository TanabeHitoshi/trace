def on_button_pressed_a():
    global pattern
    basic.clear_screen()
    pattern = 10
input.on_button_pressed(Button.A, on_button_pressed_a)

def モニタ():
    serial.write_value("0", pins.analog_read_pin(AnalogPin.P0))
    serial.write_value("1", pins.analog_read_pin(AnalogPin.P1))
    serial.write_value("2", pins.analog_read_pin(AnalogPin.P2))
    serial.write_value("line_pos", ライン位置())
    serial.write_line("-------------------------------------------------")
def ライン位置():
    global kp, kd, 差分, 微分, 制御量, 前差分
    kp = 20
    kd = 20
    差分 = pins.analog_read_pin(AnalogPin.P1) - pins.analog_read_pin(AnalogPin.P2)
    微分 = 差分 - 前差分
    制御量 = 差分 * kp + 微分 * kd
    前差分 = 差分
    return 制御量
def 走る(スピード: number, 回転速度: number):
    global 左スピード, 右スピード
    左スピード = スピード - 回転速度
    右スピード = スピード + 回転速度
    左モーター(左スピード)
    右モーター(右スピード)

def on_button_pressed_b():
    global pattern
    basic.clear_screen()
    pattern = 20
input.on_button_pressed(Button.B, on_button_pressed_b)

def 左モーター(スピード: number):
    global 左スピード
    左スピード = スピード
    if 左スピード >= 0:
        pins.digital_write_pin(DigitalPin.P12, 0)
        pins.digital_write_pin(DigitalPin.P16, 1)
    else:
        pins.digital_write_pin(DigitalPin.P12, 1)
        pins.digital_write_pin(DigitalPin.P16, 0)
    # 正転のリミット
    if 左スピード > 1024:
        左スピード = 1023
    # 逆転のリミット
    if 左スピード < -1023:
        左スピード = -1023
    # ブレーキ
    if 左スピード == 0:
        pins.digital_write_pin(DigitalPin.P12, 1)
        pins.digital_write_pin(DigitalPin.P16, 1)
    else:
        pins.analog_write_pin(AnalogPin.P8, abs(左スピード))
def 右モーター(スピード: number):
    global 右スピード
    右スピード = スピード
    if 右スピード >= 0:
        pins.digital_write_pin(DigitalPin.P15, 0)
        pins.digital_write_pin(DigitalPin.P14, 1)
    else:
        pins.digital_write_pin(DigitalPin.P15, 1)
        pins.digital_write_pin(DigitalPin.P14, 0)
    # 正転のリミット
    if 右スピード > 1024:
        右スピード = 1023
    # 逆転のリミット
    if 右スピード < -1023:
        右スピード = -1023
    # ブレーキ
    if 右スピード == 0:
        pins.digital_write_pin(DigitalPin.P14, 1)
        pins.digital_write_pin(DigitalPin.P15, 1)
    else:
        pins.analog_write_pin(AnalogPin.P13, abs(右スピード))
def 右手2():
    pass
def 右手():
    global kp, kd, 差分, 微分, 制御量, 前差分
    kp = 20
    kd = 20
    差分 = pins.analog_read_pin(AnalogPin.P1) - pins.analog_read_pin(AnalogPin.P2)
    微分 = 差分 - 前差分
    制御量 = 差分 * kp + 微分 * kd
    前差分 = 差分
    return 制御量
右スピード = 0
左スピード = 0
制御量 = 0
前差分 = 0
微分 = 0
差分 = 0
kd = 0
kp = 0
pattern = 0
basic.show_leds("""
    . # # # .
    . . # . .
    . . # . .
    # . # . .
    . # . . .
    """)
右モーター(0)
左モーター(0)
pattern = 0

def on_forever():
    if pattern == 10:
        走る(700, ライン位置())
    if pattern == 20:
        モニタ()
        basic.pause(500)
basic.forever(on_forever)
