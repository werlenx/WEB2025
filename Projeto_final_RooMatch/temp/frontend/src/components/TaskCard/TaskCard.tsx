import React from 'react';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  id: number;
  title: string;
  description?: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  points: number;
  dueDate: string;
  status: 'PENDING' | 'AWAITING_REVIEW' | 'COMPLETED' | 'FAILED' | 'REDO' | 'BOUGHT_OUT';
  canBuyOut: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  frequency,
  points,
  dueDate,
  status,
  canBuyOut,
}) => {
  return (
    <div className={styles.taskCard}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      <p className={styles.frequency}>Frequency: {frequency}</p>
      <p className={styles.points}>Points: {points}</p>
      <p className={styles.dueDate}>Due Date: {new Date(dueDate).toLocaleString()}</p>
      <p className={styles.status}>Status: {status}</p>
      <p className={styles.canBuyOut}>Can Buy Out: {canBuyOut ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default TaskCard;