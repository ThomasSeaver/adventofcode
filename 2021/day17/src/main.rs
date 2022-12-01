use std::collections::HashSet;
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
        println!("Input {}: {}", index, input);

        let start = Instant::now();

        let bounds = parse_target_bounds(input);
        let velocity = generate_velocity(&bounds);

        println!("Velocity: ({}, {})", velocity.0, velocity.1);
        println!("Highest y-value: {}", calculate_y_peak(velocity.1));
        println!("Potential velocities count: {}", count_velocities(&bounds));
        println!("Time elapsed: {:?}", start.elapsed());
        println!();
    }
}

fn parse_target_bounds(input: &str) -> ((i32, i32), (i32, i32)) {
    let mut iter = input[13..].split(", ");
    let x: Vec<i32> = iter.next().expect("x parse fails")[2..]
        .split("..")
        .map(|s| i32::from_str_radix(s, 10).expect("Bad num"))
        .collect();
    let y: Vec<i32> = iter.next().expect("x parse fails")[2..]
        .split("..")
        .map(|s| i32::from_str_radix(s, 10).expect("Bad num"))
        .collect();

    let bounds = ((x[0], x[1]), (y[0], y[1]));
    bounds
}

fn generate_velocity(bounds: &((i32, i32), (i32, i32))) -> (i32, i32) {
    let x_bounds = bounds.0;
    let mut x_vel = 0;
    loop {
        x_vel += 1;
        let mut sum = 0;
        for step in (0..(x_vel + 1)).rev() {
            sum += step;
            if sum >= x_bounds.0 {
                break;
            }
        }
        if x_bounds.0 <= sum && sum <= x_bounds.1 {
            break;
        }
    }

    let y_bounds = bounds.1;
    let y_vel = y_bounds.0 * -1 - 1;

    (x_vel, y_vel)
}

fn calculate_y_peak(y_vel: i32) -> i32 {
    (y_vel * (y_vel + 1)) / 2
}

fn count_velocities(bounds: &((i32, i32), (i32, i32))) -> usize {
    let x_bounds = bounds.0;
    let y_bounds = bounds.1;
    let mut potential_steps: Vec<(i32, i32)> = vec![];

    for step in 1..(x_bounds.1 + 1) {
        let mut pos = 0;
        let mut vel = step;
        let mut count = 0;
        while pos < x_bounds.1 && vel > -1000 {
            if vel > 0 {
                pos += vel;
            }
            vel -= 1;
            count += 1;
            if pos >= x_bounds.0 && pos <= x_bounds.1 {
                potential_steps.push((step, count));
            }
        }
    }

    let mut potential_velocities = HashSet::new();

    for (x_vel, step_count) in &potential_steps {
        for y_vel in y_bounds.0..(y_bounds.0 * -1) {
            let disp = y_vel * step_count + -1 * ((step_count - 1).pow(2) + (step_count - 1)) / 2;
            if disp >= y_bounds.0 && disp <= y_bounds.1 {
                potential_velocities.insert((x_vel, y_vel));
            }
        }
    }
    potential_velocities.len()
}
