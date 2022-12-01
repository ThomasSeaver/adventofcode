const fs = require('fs')

const read = (filename) => {
    let data;
    try {
        data = fs.readFileSync(filename, 'utf8');
      } catch (err) {
        console.error(err)
      }
    return data;
}

const process = (data) => {
    return data.split('---\n').map((line) => line.trim());
}

const i1 = process(read('i1.txt'));
//const i2 = process(read('i2.txt'));

class Node {
    constructor(content, parent, depth = 0) {
        this.parent = parent;
        this.depth = depth;
        if (Array.isArray(content)) {
            this.left = new Node(content[0], this, depth + 1);
            this.right = new Node(content[1], this, depth + 1);
            this.value = null;
        } else {
            this.value = content;
            this.left = null;
            this.right = null;
        }
    }

    buildDepthChart = (chart, parentIndex = 0) => {
        const value = this.value ?? 'x';
        if (chart.length == this.depth) {
            chart.push([]);
        }
        chart[this.depth].push({value, parentIndex});
        if (this.left) {
            chart = this.left.buildDepthChart(chart, parentIndex * 2 );
        }
        if (this.right) {
            chart = this.right.buildDepthChart(chart, parentIndex * 2 + 1);
        }
        return chart;
    }

    display = () => {
        const chart = this.buildDepthChart([]);
        let output = '';
        for (let [depth, depthLine] of chart.entries()) {    
            let newLine = '\n';    
            const separator = ' '.repeat(Math.pow(2, chart.length - depth) - 1);
            for (let index = 0; index < Math.pow(2, depth); index++) {
                newLine += (depthLine.find((spot) => spot.parentIndex === index)?.value ?? ' ') + separator;
            }
            output += newLine;
        }
        return output;
      }

      toString = () => {
          if (this.value != null) {
              return this.value;
          } else {
              return `[${this.left.toString()},${this.right.toString()}]`
          }
        }
    }

const getExplode = (root, depth) => {
    if (depth >= 4 && root.left.value != null && root.right.value != null) {
        return root;
    }
    for (const branch of [root.left, root.right]) {
        if (branch.value === null) {
            const res = getExplode(branch, depth + 1);
            if (res) {
                return res;
            }
        }
    }
    return null;
}

const getSplit = (root) => {
    for (const branch of [root.left, root.right]) {
        if (branch.value >= 10) {
            return branch;
        }
        if (branch.value === null) {
            const res = getSplit(branch);
            if (res?.value) {
                return res;
            }
        }
    }
    return null;
}

const find = (initial, dir) => {
    let past = initial;
    let cur = initial.parent;
    while (cur && cur[dir] == past) {
        past = cur;
        cur = cur.parent;
    }
    if (cur) {
        cur = cur[dir];
        const oppDir = dir === 'left' ? 'right' : 'left';
        while (cur[oppDir]) {
            cur = cur[oppDir];
        }
    }
    return cur;
}

/**
 * Step of snailfish number reduction
 */
const step = (root) => {
    let stepTaken = false;
    const explode = getExplode(root, 0);
    const split = getSplit(root);
    if (explode) {
        const left = find(explode, 'left');
        const right = find(explode, 'right');
        if (left) {
            left.value += explode.left.value;
        }
        if (right) {
            right.value += explode.right.value;
        }
        explode.left = null;
        explode.right = null;
        explode.value = 0;
        stepTaken = true;
    } else if (split) {
        split.left = new Node(Math.floor(split.value / 2), split, split.depth + 1);
        split.right = new Node(Math.ceil(split.value / 2), split, split.depth + 1);
        split.value = null;
        stepTaken = true;
    }
    return stepTaken;
}

const magnitude = (root) => {
    const left = 3 * (root.left.value ?? magnitude(root.left));
    const right = 2 * (root.right.value ?? magnitude(root.right));
    return left + right;
}

for (const number of i1) {
    const numberSteps = number.split('\n');
    let A = numberSteps.shift();
    while (numberSteps.length > 0) {
        const B = numberSteps.shift();
        const added = `[${A},${B}]`;
        const root = new Node(JSON.parse(added));
        let stepTaken = true;
        let count = 0;
        //console.log(`\n${count}:\n`, root.display());
        while (stepTaken) {
            count += 1;
            stepTaken = step(root);
            //console.log(`\n${count}:\n`, root.display());
        }
        A = root.toString();
        console.log(`\n${count}: `, A);
    }
    console.log(magnitude(new Node(JSON.parse(A))));
    console.log()
}

for (const numberSet of i1) {
    const numberLines = numberSet.split('\n');
    let maxMagnitude = 0;
    for (const number of numberLines) {
        const complementSet = numberLines.filter(num => num != number);
        for (const compNumber of complementSet) {
            const added = `[${number},${compNumber}]`;
            const root = new Node(JSON.parse(added));
            let stepTaken = true;
            let count = 0;
            while (stepTaken) {
                count += 1;
                stepTaken = step(root);
            }
            A = root.toString();
            maxMagnitude = Math.max(maxMagnitude, magnitude(root))
        }
    }
    console.log(maxMagnitude);
    console.log()
}

