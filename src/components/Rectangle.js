var EventEmitter = require('events');

class Rectangle extends EventEmitter {
    constructor(canvas) {
        super()
        this.canvas = canvas;
        this.className = 'Rectangle';
        this.isDrawing = false;
        this.origX = 0;
        this.origY = 0;
        this.activeObj = null;
        this.bindEvents();
        this.currentObject = null;
        this.rectNumb = 0;
        this.hoverTarget = false;
        document.addEventListener('keydown', this.handleKey.bind(this), false)

        this.instructionText = null;
    }

    bindEvents() {
        this.canvas.on('mouse:down', (o) => {
            this.onMouseDown(o);
        });
        this.canvas.on('mouse:move', (o) => {
            this.onMouseMove(o);
        });
        this.canvas.on('mouse:up', (o) => {
            this.onMouseUp(o);
        });
        this.canvas.on('object:moving', (o) => {
            this.disable();
        })

        this.canvas.on('mouse:over', (e) => {
            if (e.target.lockMovementX) {

                this.hoverTarget = true;
                this.currentObject = e.target;
                e.target.set('fill', '#f28e65');
                e.target.opacity = 0.4;

                this.instructionText = new fabric.Text('Press R To Remove', {
                    left: e.target.left,
                    top: e.target.top - 15,
                    fontSize: 13,
                    fontWeight: 'bold',
                    fontFamily: 'Solway',
                    fill: 'white',
                    backgroundColor: 'black',
                    
                })
                
                
                this.canvas.add(this.instructionText)
                
                this.canvas.renderAll();
            } else {
                return
            }

        })

        // this.canvas.on('mouse:dblclick', e => {
        //     this.emit('remove', e.target.name)
        //     this.canvas.remove(e.target)

        // })

        this.canvas.on('mouse:out', (e) => {
            e.target.set('fill', 'transparent');
            this.canvas.renderAll();   
            this.hoverTarget = false
            this.canvas.remove(this.instructionText)
        });

    }

    handleKey(key) {
        if (key.key == "r" && this.hoverTarget) {
            
            this.canvas.remove(this.currentObject)
            this.canvas.remove(this.instructionText)
            this.emit('remove', this.currentObject.name)
        } else {
        }
    }
    onMouseUp(o) {
        this.disable();
        let drawnRect = this.activeObj
        this.activeObj.lockMovementX = true
        this.activeObj.lockMovementY = true

        if (drawnRect.height > 25 && drawnRect.width > 25) {
            this.emit('done', {
                height: drawnRect.height,
                width: drawnRect.width,
                top: drawnRect.top,
                left: drawnRect.left,
                name: this.activeObj.name
            });
        }
  

    }

    onMouseDown(o) {
        this.enable();

        var pointer = this.canvas.getPointer(o.e);
        this.origX = pointer.x;
        this.origY = pointer.y;
        var rect = new fabric.Rect({
            left: this.origX,
            top: this.origY,
            originX: 'left',
            originY: 'top',
            width: pointer.x - this.origX,
            height: pointer.y - this.origY,
            angle: 0,
            transparentCorners: false,
            hasBorders: false,
            hasControls: false,
            name: `rect_${this.rectNumb}`
        });

        this.canvas.add(rect).setActiveObject(rect);
        this.rectNumb++;
    }

    onMouseMove(o) {

        if (!this.isEnable()) { return; }
        var pointer = this.canvas.getPointer(o.e);
        this.activeObj = this.canvas.getActiveObject();

        this.activeObj.stroke = 'red';
        this.activeObj.strokeWidth = 2;
        this.activeObj.fill = 'transparent';

        if (this.origX > pointer.x) {
            this.activeObj.set({ left: Math.abs(pointer.x) });
        }
        if (this.origY > pointer.y) {
            this.activeObj.set({ top: Math.abs(pointer.y) });
        }

        let width = Math.abs(this.origX - pointer.x);
        let height = Math.abs(this.origY - pointer.y)

        if (width > 25 && height > 25) {
            this.activeObj.set({ width: width });
            this.activeObj.set({ height: height });
            this.activeObj.setCoords();
            this.canvas.renderAll();
        } else {
            return
        }

    }
    isEnable() {
        return this.isDrawing;
    }

    enable() {
        this.isDrawing = true;
    }

    disable() {
        this.isDrawing = false;
    }

}

export default Rectangle;