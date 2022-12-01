use std::fs;
use std::time::Instant;

fn get_inputs() -> Vec<String> {
    // Parse file input
    let file_content = fs::read_to_string("i.txt").expect("Something went wrong reading the file");

    // Split to different input sets
    let inputs: Vec<String> = file_content
        .split("\n***\n")
        .map(|s| String::from(s))
        .collect();

    return inputs;
}

fn main() {
    let inputs = get_inputs();

    for (index, input) in inputs.iter().enumerate() {
        println!("Input {}: {}...", index, &input[0..5]);

        let binary: String = input
            .chars()
            .map(|c| hex_to_binary(c))
            .collect::<Vec<String>>()
            .join("");

        let start = Instant::now();

        let (packet, _) = parse_packet(String::from(binary));
        println!("Sum of Packet Versions: {}", packet_version_sum(&packet));
        println!(
            "Operation Packet Value: {}",
            packet_operation_value(&packet)
        );
        println!("Time elapsed: {:?}", start.elapsed());
        println!();
    }
}

struct Packet {
    version: u8,
    type_id: u8,
    value: u64,
    sub_packets: Vec<Packet>,
}

fn parse_packet(packet_binary: String) -> (Packet, String) {
    let version = binary_to_u8(&packet_binary[0..3]);
    let type_id = binary_to_u8(&packet_binary[3..6]);

    // Literal packets
    if type_id == 4 {
        let mut index: usize = 6;
        let mut value = String::from("");

        loop {
            let slice = &packet_binary[index..index + 5];
            value += &slice[1..];
            index += 5;
            if slice.starts_with("0") {
                break;
            }
        }
        let value = binary_to_u64(&value);

        // println!(
        //     "literal: packet_version: {} ; type_id : {} ; value : {}",
        //     version,
        //     type_id,
        //     value.to_string()
        // );
        return (
            Packet {
                version,
                type_id,
                value,
                sub_packets: vec![],
            },
            String::from(&packet_binary[index..]),
        );
    // Operator packets
    } else {
        let length_type_id = &packet_binary[6..7];
        if length_type_id == "0" {
            let sub_packet_length = binary_to_u16(&packet_binary[7..22]);

            // println!(
            //     "operate: packet_version: {} ; type_id : {} ; length : {}",
            //     version, type_id, sub_packet_length
            // );
            let mut sub_packets: Vec<Packet> = vec![];
            let mut remaining = String::from(&packet_binary[22..]);
            let mut counted_bits = 0;

            loop {
                let orig_length = remaining.len();
                let (packet, new_remaining) = parse_packet(remaining);
                sub_packets.push(packet);
                counted_bits += orig_length - new_remaining.len();

                remaining = new_remaining;
                if counted_bits == sub_packet_length.try_into().unwrap() {
                    break;
                }
            }

            return (
                Packet {
                    version,
                    type_id,
                    value: 0,
                    sub_packets,
                },
                String::from(&remaining),
            );
        } else {
            let sub_packet_count = binary_to_u16(&packet_binary[7..18]);

            // println!(
            //     "operate: packet_version: {} ; type_id : {} ; count : {}",
            //     version, type_id, sub_packet_count
            // );
            let mut sub_packets: Vec<Packet> = vec![];
            let mut remaining = String::from(&packet_binary[18..]);

            for _ in 0..sub_packet_count {
                let (packet, new_remaining) = parse_packet(remaining);
                sub_packets.push(packet);
                remaining = new_remaining;
            }

            return (
                Packet {
                    version,
                    type_id,
                    value: 0,
                    sub_packets,
                },
                String::from(remaining),
            );
        }
    }
}

fn hex_to_binary(c: char) -> String {
    match c {
        '0' => String::from(String::from("0000")),
        '1' => String::from("0001"),
        '2' => String::from("0010"),
        '3' => String::from("0011"),
        '4' => String::from("0100"),
        '5' => String::from("0101"),
        '6' => String::from("0110"),
        '7' => String::from("0111"),
        '8' => String::from("1000"),
        '9' => String::from("1001"),
        'A' => String::from("1010"),
        'B' => String::from("1011"),
        'C' => String::from("1100"),
        'D' => String::from("1101"),
        'E' => String::from("1110"),
        'F' => String::from("1111"),
        _ => String::from(""),
    }
}

fn binary_to_u8(s: &str) -> u8 {
    return u8::from_str_radix(s, 2).expect("Bad binary");
}

fn binary_to_u16(s: &str) -> u16 {
    return u16::from_str_radix(s, 2).expect("Bad binary");
}

fn binary_to_u64(s: &str) -> u64 {
    return u64::from_str_radix(s, 2).expect("Bad binary");
}

fn packet_version_sum(packet: &Packet) -> u16 {
    let mut sum = packet.version as u16;
    for sub_packet in &packet.sub_packets {
        sum += packet_version_sum(&sub_packet);
    }
    return sum;
}

fn packet_operation_value(packet: &Packet) -> u64 {
    if packet.type_id == 0 {
        let mut sum = 0;
        for sub_packet in &packet.sub_packets {
            sum += packet_operation_value(&sub_packet);
        }
        return sum;
    } else if packet.type_id == 1 {
        let mut mult = 1;
        for sub_packet in &packet.sub_packets {
            mult *= packet_operation_value(&sub_packet);
        }
        return mult;
    } else if packet.type_id == 2 {
        let mut min = u64::MAX;
        for sub_packet in &packet.sub_packets {
            min = min.min(packet_operation_value(&sub_packet));
        }
        return min;
    } else if packet.type_id == 3 {
        let mut max = u64::MIN;
        for sub_packet in &packet.sub_packets {
            max = max.max(packet_operation_value(&sub_packet));
        }
        return max;
    } else if packet.type_id == 4 {
        return packet.value;
    } else if packet.type_id == 5 {
        let a_value = packet_operation_value(&packet.sub_packets[0]);
        let b_value = packet_operation_value(&packet.sub_packets[1]);
        return if a_value > b_value { 1 } else { 0 };
    } else if packet.type_id == 6 {
        let a_value = packet_operation_value(&packet.sub_packets[0]);
        let b_value = packet_operation_value(&packet.sub_packets[1]);
        return if a_value < b_value { 1 } else { 0 };
    } else if packet.type_id == 7 {
        let a_value = packet_operation_value(&packet.sub_packets[0]);
        let b_value = packet_operation_value(&packet.sub_packets[1]);
        return if a_value == b_value { 1 } else { 0 };
    }
    panic!("Invalid type_id {}", packet.type_id);
}
